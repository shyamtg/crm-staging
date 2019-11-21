from rest_framework import serializers, fields, status
from . import models
from django.contrib.auth.models import Group
from drf_extra_fields.fields import Base64ImageField
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from rest_framework.exceptions import APIException


class TeamSerializer(serializers.ModelSerializer):
    team_meta = serializers.SerializerMethodField()
    meta_data = serializers.DictField(write_only=True)
    profile_pic = Base64ImageField()

    class Meta:
        model = models.Teams
        fields = ('id', 'team_name', 'profile_pic', 'owner', 'created_on', 'last_updated_on', 'team_meta', 'meta_data')
        read_only_fields = ["team_meta"]
        depth=1

    def get_team_meta(self, obj):
        teams = models.TeamMeta.objects.filter(
            team_id=obj.id)
        return TeamMetaSerializer(teams, many=True).data

    def to_representation(self, instance):
        response = super().to_representation(instance)
        return response

    def create(self, validated_data):
        try:
            with transaction.atomic():
                save_point_obj = transaction.savepoint()
                super_user = models.CustomUser.objects.get(id=self.context['request'].user.id)
                try:
                    user_team_instance = models.UserTeamRoleMapping.objects.get(
                        user_id=super_user.id)
                    if user_team_instance:
                        raise serializers.ValidationError({"detail": "Team exists for the signed in user"},
                                                          status.HTTP_400_BAD_REQUEST)

                except ObjectDoesNotExist:
                    team_instance = models.Teams.objects.create(
                            team_name=validated_data["team_name"],
                            owner_id=super_user.id,
                        profile_pic=validated_data.get("profile_pic", None)
                        )
                    if "meta_data" in validated_data:
                        for key, value in validated_data["meta_data"].items():
                            TeamMetaSerializer().create({
                                "team": team_instance,
                                "meta_key": key,
                                "meta_value": value

                            })
                    # Map role in team
                    UserTeamRoleMappingSerializer().create({
                        "user" : super_user,
                        "team" : team_instance,
                        "role" : models.TeamRoles.objects.get(role_name='admin'),
                        "created_by" : super_user,
                        "last_updated_by" : super_user

                    })
                    transaction.savepoint_commit(save_point_obj)
                return team_instance
        except Exception as e:
            raise serializers.ValidationError({"detail": e}, status.HTTP_400_BAD_REQUEST)


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name')


class TeamRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TeamRoles
        fields = ('id','role_name',)


class UserTeamRoleMappingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserTeamRoleMapping
        fields = '__all__'


class TeamMetaSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.TeamMeta
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    groups = serializers.PrimaryKeyRelatedField(many=True, queryset=Group.objects.all())
    teams = TeamSerializer(many=True, read_only=True)

    # Read only & write only fields required to access non model fields
    # https://stackoverflow.com/questions/53726541/django-rest-framework-serializermethodfield-is-null-on-serializer-save
    team_role = serializers.SerializerMethodField()
    role = serializers.PrimaryKeyRelatedField(
        source='team_role',
        queryset=models.TeamRoles.objects.all(),
        write_only=True
    )

    class Meta:
        model = models.CustomUser
        fields = ('id','username', 'password', 'first_name', 'last_name', 'email', 'user_mobile_number', 'groups', 'teams', 'role', 'team_role', 'profile_pic')
        read_only_fields = ['groups', 'teams', 'role']
        depth = 1

    def get_team_role(self, obj):
        roles_available = models.UserTeamRoleMapping.objects.filter(
            user_id=obj.id)
        return UserTeamRoleMappingSerializer(roles_available, many=True).data

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response.pop('password')
        try:
            response['groups'] = GroupSerializer(instance.groups.all()[0]).data['name']
            for index in range(len(response['team_role'])):
                role = (response['team_role'][index]['role'])
                team = (response['team_role'][index]['team'])
                team_qs = models.Teams.objects.filter(id=team)
                role_qs = models.TeamRoles.objects.filter(id=role)
                response['team_role'][index]['role_name'] = TeamRoleSerializer(instance=role_qs[0]).data['role_name']
                response['team_role'][index]['team_name'] = TeamSerializer(instance=team_qs[0]).data['team_name']
        except IndexError as e:
            response['groups'] = None
        return response

    def create(self, validated_data):
        try:
            with transaction.atomic():
                save_point_obj = transaction.savepoint()
                # Create User
                new_user = models.CustomUser.objects.create_user(
                    username=validated_data['username'],
                    first_name=validated_data['first_name'],
                    last_name=validated_data['last_name'],
                    email=validated_data['email'],
                    password=validated_data['password'],
                    user_mobile_number=validated_data['user_mobile_number'],
                    profile_pic=validated_data.get("profile_pic", None))
                # Map group
                new_user.groups.add(validated_data['groups'][0])
                # Set user default preference
                models.UserPreferences.objects.create(user_id=new_user.id)
                if self.context['request'].user.is_authenticated:
                    # If existing user creates another user, map existing user's team
                    admin_user = models.CustomUser.objects.get(id=self.context['request'].user.id)
                    try:
                        team_instance = models.Teams.objects.get(
                            owner_id=admin_user.id
                        )
                        # Map role in team
                        UserTeamRoleMappingSerializer().create(
                            {"user": new_user,
                             "team": team_instance,
                             "role": validated_data['team_role'],
                             "created_by": new_user,
                             "last_updated_by": new_user}
                        )
                    except ObjectDoesNotExist:
                        pass
                transaction.savepoint_commit(save_point_obj)
            return new_user
        except Exception as e:
            raise APIException({"detail": e})


class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = ('username', 'password')


class UserPreferencesSerializer(serializers.ModelSerializer):
    available_days = fields.MultipleChoiceField(choices=models.UserPreferences.DAY_CHOICES)

    class Meta:
        model = models.UserPreferences
        fields = ('id', 'user_id', 'available_days', 'available_from',
                  'available_till', 'timezone_field', 'is_sms_preferred', 'is_mail_preferred','flag_view_as_team')
        read_only_fields = ['user_id']

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['timezone_field'] = str( response['timezone_field'])
        return response

    def create(self, validated_data):
        try:
            validated_data['available_days'] = list(validated_data['available_days'])
            pref_instance = UserPreferencesSerializer().create(**validated_data)
            return pref_instance
        except Exception as e:
            raise serializers.ValidationError({"detail": e}, status.HTTP_400_BAD_REQUEST)
