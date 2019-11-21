from . import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('uservsleadstatus', views.UserVsLeadStatusAnalyticsViewSet, basename='uservsleadstatus')
urlpatterns = [
]


urlpatterns += router.urls
