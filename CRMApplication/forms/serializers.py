from rest_framework import serializers, status
from . import models
from django.db import transaction
from users.serializers import UserSerializer

class FormDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.FormData
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['user'] = UserSerializer(instance.user).data
        return response

class FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Forms
        fields = '__all__'
        read_only_fields = ['form_owner']

    def validate_form_owner(self, data):
        return data

    def create(self, validated_data):
        try:
            validated_data['form_owner'] = self.context['request'].user
            with transaction.atomic():
                save_point_obj = transaction.savepoint()
                form_instance = super().create(validated_data)
                validated_data_user_form_map = {
                    'form': form_instance,
                    'user': self.context['request'].user
                }
                UserFormMappingSerializer().create(validated_data_user_form_map)
                transaction.savepoint_commit(save_point_obj)
            return form_instance
        except Exception as e:
            raise serializers.as_serializer_error({"detail": e}, status.HTTP_400_BAD_REQUEST)


class UserFormMappingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserFormMapping
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['form'] = FormSerializer(instance.form).data
        response['user'] = UserSerializer(instance.user).data
        return response