from . import models, serializers
from rest_framework.response import Response
from rest_framework import status, views, permissions, viewsets, mixins, pagination
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from . import permissions as custom_permission
import uuid, pytz, json
from django.contrib.auth import logout
from django.contrib.auth.models import Group
from django.utils import timezone
from rest_framework import filters
from rest_framework.parsers import MultiPartParser
from django.core.exceptions import ObjectDoesNotExist
from . import ADMIN_ROLE
from django.db.models import Q
from forms import models as form_models
from rest_framework.exceptions import APIException


def get_user_queryset(view_instance):
    try:
        if custom_permission.IsTeamAdmin().has_permission(view_instance.request, view_instance):
            if view_instance.action == 'list' and not models.UserPreferences.objects.get(
                    user_id=view_instance.request.user.id).flag_view_as_team:
                return models.CustomUser.objects.filter(
                    user_id=view_instance.request.user.id)
            else:
                return models.CustomUser.objects.filter(
                    id__in=models.UserTeamRoleMapping.objects.filter(
                        team_id= models.UserTeamRoleMapping.objects.get(
                    user_id=view_instance.request.user.id).team_id).values('user_id'))
    except Exception as e:
        print(e)
    return models.CustomUser.objects.filter(
                id=view_instance.request.user.id)


class IsSuperuser(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, format=None):
        return Response(request.user.is_superuser)


class GroupViewset(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer


class TeamRoleViewset(viewsets.ModelViewSet):
    pagination_class = None
    queryset = models.TeamRoles.objects.all()
    serializer_class = serializers.TeamRoleSerializer


class TeamViewset(viewsets.ModelViewSet):
    queryset = models.Teams.objects.all()
    parser_classes = [MultiPartParser]
    serializer_class = serializers.TeamSerializer

    def get_permissions(self):
        permission_classes = [permissions.IsAdminUser()]
        return permission_classes

    def get_queryset(self):
        signed_in_user = models.CustomUser.objects.get(id=self.request.user.id)
        teams = models.UserTeamRoleMapping.objects.filter(user_id=signed_in_user)
        return models.Teams.objects.filter(id__in=teams.values('team_id'))


class UserProfileViewSet(
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
        viewsets.GenericViewSet):
    """
    This class takes care of user registration
    """
    queryset = models.CustomUser.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return models.CustomUser.objects.filter(
            id=self.request.user.id)


class UserLoginViewSet(viewsets.GenericViewSet):
    """
    This class takes care of login

    """
    queryset = models.CustomUser.objects.all()
    serializer_class = serializers.UserLoginSerializer

    def create(self, request, *args, **kwargs):
        user = authenticate(
            username=request.POST.get('username'),
            password=request.POST.get('password'))
        if user:
            login(request, user)
            return Response("Registered & Logged in", status=status.HTTP_202_ACCEPTED)
        return Response("User login failed", status=status.HTTP_401_UNAUTHORIZED)


class UserLogoutAllView(views.APIView):
    """
    Use this endpoint to log out all sessions for a given user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        user.jwt_secret = uuid.uuid4()
        user.save()
        logout(request)
        return JsonResponse({'data' : 'Logged out'}, status=status.HTTP_202_ACCEPTED)


class UserPreferencesViewSet(viewsets.ModelViewSet):
    """
    Handles managing user preferences
    """
    queryset = models.UserPreferences.objects.all()
    serializer_class = serializers.UserPreferencesSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    # lookup_field = 'user'

    def get_queryset(self):
        return models.UserPreferences.objects.filter(
            user_id=self.request.user.id)

    def perform_create(self, serializer):
        serializer.save(user_id = self.request.user.id)


class TimezoneView(views.APIView):
    """
    To list timezones
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return JsonResponse({'data': [tz for tz in pytz.all_timezones]}, status=status.HTTP_202_ACCEPTED)


class CurrentTimezoneView(views.APIView):
    """
    To list timezones
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return JsonResponse({'data': str(timezone.get_current_timezone())}, status=status.HTTP_202_ACCEPTED)


class UserListViewSet(viewsets.ModelViewSet):
    queryset = models.CustomUser.objects.all()
    serializer_class = serializers.UserSerializer
    pagination_class = pagination.PageNumberPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['username','first_name','last_name','email']

    def get_permissions(self):
        permission_classes = [permissions.IsAuthenticated()]
        if self.action in ['list'] and ('unmapped_users' in self.request.query_params or 'mapped_users' in self.request.query_params):
            permission_classes = [custom_permission.IsTeamAdmin()]
        if self.action in ['update', 'partial_update', 'destroy', 'list']:
            permission_classes = [permissions.IsAuthenticated()]
        elif self.action in ['create']:
            permission_classes = [custom_permission.IsTeamAdmin()]
        return permission_classes


    def get_queryset(self):
        try:
            team_role_instance = models.UserTeamRoleMapping.objects.get(
                user_id=self.request.user.id)
            if models.TeamRoles.objects.get(id=team_role_instance.role_id).role_name == ADMIN_ROLE:
                users_in_team = models.UserTeamRoleMapping.objects.filter(team_id=team_role_instance.team_id)
                team_users_qs = models.CustomUser.objects.filter(id__in=users_in_team.values('user_id'))
            # To get unmapped users for particular form in user's own team
            if 'unmapped_users' in self.request.query_params and self.request.query_params['unmapped_users'].lower() == "true":
                filter_specific_form_map = form_models.UserFormMapping.objects.filter(form_id=self.request.query_params['form_id'])
                return team_users_qs.filter(~Q(id__in=[item.user_id for item in filter_specific_form_map]))
            # To get mapped users for particular form in user's own team
            if 'mapped_users' in self.request.query_params and self.request.query_params['mapped_users'].lower() == "true":
                filter_specific_form_map = form_models.UserFormMapping.objects.filter(form_id=self.request.query_params['form_id'])
                return team_users_qs.filter(Q(id__in=[item.user_id for item in filter_specific_form_map]))
            # For admin user
            if models.TeamRoles.objects.get(id=team_role_instance.role_id).role_name == ADMIN_ROLE:
                return team_users_qs
            # For non admin user
            else:
                return models.CustomUser.objects.filter(id=self.request.user.id)
        except ObjectDoesNotExist as e:
            # When user doesn't belong to any team
            return models.CustomUser.objects.filter(id=self.request.user.id)
        except Exception as e:
            raise APIException({"detail": e})

    def destroy(self, request, *args, **kwargs):
        body_unicode = request.body.decode('utf-8')
        if body_unicode:
            body = json.loads(body_unicode)
            if 'users' in body:
                try:
                    user_list = body['users']
                    if user_list:
                        for user in user_list:
                            instance = models.CustomUser.objects.get(id=user)
                            self.perform_destroy(instance)
                        return Response(status=status.HTTP_204_NO_CONTENT)
                    return Response({"detail": "User list empty"}, status=status.HTTP_400_BAD_REQUEST)
                except Exception as e:
                    return Response({"detail":str(e)}, status=status.HTTP_501_NOT_IMPLEMENTED)
            return Response({"detail":"Missing users list"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Missing users list"}, status=status.HTTP_400_BAD_REQUEST)


