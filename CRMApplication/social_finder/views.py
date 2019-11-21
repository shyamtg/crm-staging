from django.shortcuts import render
from rest_framework import status, views, permissions, viewsets, pagination
from rest_framework.response import Response
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from appointment_scheduler.settings import BASE_DIR, MEDIA_ROOT
from .utility import searcher
import os
class search_by_image(views.APIView):
    # # parser_classes = [FileUploadParser]
    #
    def post(self, request):
        file_obj = request.data['file']
        path = default_storage.save(os.path.join(MEDIA_ROOT,'images/social_finder/',file_obj.name), ContentFile(file_obj.read()))
        search_url = "https://www.google.com/searchbyimage?image_url=" + path.replace(BASE_DIR,"http://"+request.META['HTTP_HOST'])
        result = searcher(search_url)
        if result:
            return Response(result,status=status.HTTP_200_OK)
        return Response(status=status.HTTP_204_NO_CONTENT)

class search_by_email(views.APIView):
    def post(self, request):
        email = request.data['email']
        search_url = "https://www.google.com/search?q=" + email
        result = searcher(search_url)
        if result:
            return Response(result,status=status.HTTP_200_OK)
        return Response(status=status.HTTP_204_NO_CONTENT)
