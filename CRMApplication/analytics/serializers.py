from rest_framework import serializers
from appointments import models as appointment_models


class UserVsLeadStatusAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = appointment_models.Appointments
        fields = ('user_id', 'lead_status')

    def to_representation(self, instance):
        print (instance)
        # print ("here")
        # for item in instance:
        #     print (item)
        return instance