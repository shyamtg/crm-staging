from . import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('forms', views.FormsViewSet, basename='forms')
router.register('form_data', views.FormDataViewSet, basename='form_data')
router.register('user_forms', views.UserFormMappingViewSet, basename='user_forms')
urlpatterns = [
]


urlpatterns += router.urls
