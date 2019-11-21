from . import models, serializers
from rest_framework import permissions, viewsets
from users import permissions as custom_permission
from rest_framework import filters, status
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from users.views import get_user_queryset


class FormsViewSet(viewsets.ModelViewSet):
    queryset = models.Forms.objects.all()
    serializer_class = serializers.FormSerializer

    def get_permissions(self):
        permission_classes = [permissions.IsAuthenticated()]
        if self.action in ['update', 'partial_update', 'destroy', 'list']:
            permission_classes = [permissions.IsAuthenticated()]
        elif self.action in ['create']:
            permission_classes = [custom_permission.IsTeamAdmin()]
        return permission_classes


class FormDataViewSet(viewsets.ModelViewSet):
    queryset = models.FormData.objects.all()
    serializer_class = serializers.FormDataSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['status']

    def get_queryset(self):
        if custom_permission.IsTeamAdmin().has_permission(self.request, UserFormMappingViewSet) and \
                'filter_users' in self.request.query_params:
            return models.FormData.objects.filter(user_id__in=self.request.query_params['filter_users'].split(','))
        # Get Queryset based on user privilege and preference
        user_queryset = get_user_queryset(self)
        return models.FormData.objects.filter(user_id__in=[user.id for user in user_queryset])


class UserFormMappingViewSet(viewsets.ModelViewSet):
    queryset = models.UserFormMapping.objects.all()
    serializer_class = serializers.UserFormMappingSerializer

    def get_permissions(self):
        permission_classes = [custom_permission.IsTeamAdmin()]
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated()]
        return permission_classes

    def get_queryset(self):
        if custom_permission.IsTeamAdmin().has_permission(self.request, UserFormMappingViewSet) and \
                'filter_users' in self.request.query_params:
            return models.UserFormMapping.objects.filter(
                user_id__in=self.request.query_params['filter_users'].split(','))
        # Get Queryset based on user privilege and preference
        user_queryset = get_user_queryset(self)
        return models.UserFormMapping.objects.filter(
            user_id__in=[user.id for user in user_queryset])

    def destroy(self, request, *args, **kwargs):
        if 'user_id' not in self.request.query_params or 'form_id' not in self.request.query_params:
            raise APIException({"detail": "Missing input parameters"})
        instance = models.UserFormMapping.objects.get(
            form_id=self.request.query_params['form_id'], user_id=self.request.query_params['user_id'])
        if models.Forms.objects.get(id=self.request.query_params['form_id']).form_owner == instance.user:
            raise APIException({"detail": "Owner can't be unmapped"})
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

