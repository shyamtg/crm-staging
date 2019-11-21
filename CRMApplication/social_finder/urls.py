from . import views
from rest_framework.routers import DefaultRouter
from django.urls import path


router = DefaultRouter()
urlpatterns = [
    path('search_image/', views.search_by_image.as_view()),
    path('search_email/', views.search_by_email.as_view()),

]