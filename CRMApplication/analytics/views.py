from rest_framework import viewsets
from . import serializers
from appointments import models as appointment_models
from appointments import views as appointment_views
import django_filters
from django.db.models import Count
from django.http import JsonResponse
from users.views import get_user_queryset


class UserVsLeadStatusAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = appointment_models.Appointments.objects.all()
    serializer_class = serializers.UserVsLeadStatusAnalyticsSerializer
    pagination_class = None
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend]
    filter_class = appointment_views.AppointmentsFilter

    def get_queryset(self):
        if 'user' in self.request.query_params:
            return appointment_models.Appointments.objects.\
                filter(user_id=self.request.query_params.get('user')).\
                values('lead_status').\
                order_by('lead_status').\
                annotate(count=Count('lead_status'))
        # Get Queryset based on user privilege and preference
        user_queryset = get_user_queryset(self)
        return appointment_models.Appointments.objects. \
            filter(user_id__in=[user.id for user in user_queryset]). \
            values('lead_status'). \
            order_by('lead_status'). \
            annotate(count=Count('lead_status'))

    def list(self, request, *args, **kwargs):
        queryset = list(self.filter_queryset(self.get_queryset()))
        return JsonResponse(queryset, safe=False)
