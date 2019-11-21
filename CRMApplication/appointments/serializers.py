from rest_framework import serializers, status, utils
from . import models
from datetime import datetime
import pytz
from users.models import  CustomUser
from . import utils as my_utils
from rest_framework.utils import model_meta
from . import tasks
from django.db import transaction
from rest_framework.exceptions import APIException
from users.serializers import UserSerializer


class ClientSerializer(serializers.ModelSerializer):

    #overriding default validations
    def validate_client_email_id(self, client_email_id):
        return client_email_id

    def validate_client_name(self, client_name):
        return client_name

    def validate_client_contact_mobile_number(self, client_contact_mobile_number):
        return client_contact_mobile_number

    client_name = serializers.CharField()
    client_email_id = serializers.CharField()
    client_contact_mobile_number = serializers.CharField()


    class Meta:
        model = models.Clients
        fields = ('id', 'client_name','client_email_id', 'client_contact_mobile_number')
        read_only_fields = ['id']


class AppointmentSerializer(serializers.ModelSerializer):
    slot_duration = serializers.SerializerMethodField()
    client = ClientSerializer()
    user = serializers.SlugRelatedField(
        slug_field='username',
        queryset=CustomUser.objects.all())

    class Meta:
        model = models.Appointments
        fields = ('id', 'start_time', 'end_time', 'user',
                  'service', 'slot_duration', 'timezone_field', 'notes', 'lead_status',
                  'client', 'cancelled', 'cancellation_reason')

    def get_slot_duration(self, obj):
        return (obj.end_time - obj.start_time).total_seconds()/60

    def is_appointment_valid(self, validated_data):
        """
        Validate if appointment is valid
        """
        if validated_data['start_time'] < datetime.now(pytz.timezone(str(validated_data['timezone_field']))):
            raise serializers.ValidationError({"detail": "Appointment date is in past"}, status.HTTP_400_BAD_REQUEST)
        if validated_data['start_time'] >= validated_data['end_time']:
            raise serializers.ValidationError({"detail": "Appointment slot is not valid"}, status.HTTP_400_BAD_REQUEST)
        """
        Validate if any appointment doesn't exist in the chosen slot
        """
        start_time_utc = validated_data['start_time'].astimezone(pytz.timezone('UTC'))
        end_time_utc = validated_data['end_time'].astimezone(pytz.timezone('UTC'))

        start_conflict = models.Appointments.objects.filter(
            user__username=validated_data['user'].username,
            start_time__gte=start_time_utc,
            start_time__lt=end_time_utc)

        end_conflict = models.Appointments.objects.filter(
            user__username=validated_data['user'].username,
            end_time__gt=start_time_utc,
            end_time__lte=end_time_utc)

        during_conflict = models.Appointments.objects.filter(
            user__username=validated_data['user'].username,
            start_time__lte=start_time_utc,
            end_time__gte=end_time_utc)

        if start_conflict or end_conflict or during_conflict:
            raise serializers.ValidationError({"detail": "Appointment slot is Conflicting"}, status.HTTP_409_CONFLICT)

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['user'] = UserSerializer(instance.user).data
        response['client'] = ClientSerializer(instance.client).data
        response['timezone_field'] = str( response['timezone_field'])
        return response

    def create(self, validated_data):
        """
        To post appointment to DB
        :param validated_data: POST Data
        :return: Instance created
        """
        try:
            with transaction.atomic():
                save_point_obj = transaction.savepoint()
                post_data = validated_data
                validated_data = my_utils.AppointmentUtils().convert_slot_to_client_tz(
                    validated_data)
                self.is_appointment_valid(validated_data)
                """
                Post the appointment in UTC format in DB
                """
                client_data = validated_data.pop('client')
                client_instance = models.Clients.objects.get_or_create(**client_data)
                validated_data['client'] = client_instance[0]
                appt_instance = models.Appointments.objects.create(**validated_data)
                """
                Create client user mapping if non existing
                """
                client_user_map_data = {
                    'user': post_data['user'],
                    'client': client_instance[0]
                }
                models.ClientUserMapping.objects.get_or_create(**client_user_map_data)
                transaction.savepoint_commit(save_point_obj)
            tasks.send_email.delay(appt_instance.id)
            return appt_instance
        except Exception as e:
            raise APIException({"detail": e})

    def update(self, instance, validated_data):
        """
        To reschedule or cancel appointment
        :param instance: Appointment instance to be cancelled or rescheduled
        :param validated_data: Put /Patch Data
        :return: Instance updated in appointment model
        """
        try:
            info = utils.model_meta.get_field_info(instance)
            # If reschedule
            if "start_time" in validated_data or "end_time" in validated_data:
                validated_data = my_utils.AppointmentUtils().convert_slot_to_client_tz(
                    validated_data)
                self.is_appointment_valid(validated_data)
            with transaction.atomic():
                save_point_obj = transaction.savepoint()
                # Reassign user
                if 'user' in validated_data and validated_data['user'] != instance.user:
                    client_user_map_instance = models.ClientUserMapping.objects.get(user=instance.user, client=instance.client)
                    client_user_map_instance.user = validated_data['user']
                    client_user_map_instance.save()
                for attr, value in validated_data.items():
                    if attr in info.relations and info.relations[attr].to_many:
                        field = getattr(instance, attr)
                        field.set(value)
                    else:
                        setattr(instance, attr, value)
                instance.save()
                transaction.savepoint_commit(save_point_obj)
            tasks.send_update_email.delay(instance.id, instance.event_identifier)
            return instance
        except Exception as e:
            raise APIException({"detail": e})


class ServicesSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Services
        fields = ('id', 'service_name','location', 'created_by', 'last_updated_by')
        read_only_fields = ['id']


class ClientUserMapSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ClientUserMapping
        fields = ('user', 'client')
        depth = 1

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['client'] = ClientSerializer(instance.client).data
        return response['client']


