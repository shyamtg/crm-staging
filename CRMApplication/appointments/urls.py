from . import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('appointments', views.AppointmentsViewSet, basename='appointments')
router.register('appointment_booking', views.AppointmentBookingViewSet, basename='appointment_booking')
router.register('services', views.ServicesViewSet, basename='services')
router.register('clients', views.ClientUserMapViewSet, basename='clients')
router.register('upcoming-apptointments', views.UpcomingAppointments, basename='upcoming-apptointments')
urlpatterns = [
]


urlpatterns += router.urls
