from django.db import models
from users import models as user_model
from timezone_field import TimeZoneField
import pytz
from django.utils import timezone


class Clients(models.Model):
    client_name = models.CharField(
        max_length=50, blank=True, null=True)
    client_email_id = models.CharField(
        max_length=50, blank=False, null=False, unique=False)
    client_contact_mobile_number = models.CharField(
        max_length=50, blank=True, null=True)
    created_on = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    last_updated_on = models.DateTimeField(auto_now=True, blank=False, null=False)

    class Meta:
        db_table = 'clients'

    def __str__(self):
        return "{}".format(self.client_name)


class ClientMeta(models.Model):
    client = models.ForeignKey(
        Clients, null=False, blank=False, on_delete=models.CASCADE)
    meta_key = models.CharField(
        max_length=255, blank=False, null=False)
    meta_value = models.CharField(
        max_length=255, blank=False, null = False)
    created_on = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    last_updated_on = models.DateTimeField(auto_now=True, blank=False, null=False)

    class Meta:
        unique_together = ('client', 'meta_key')
        db_table = 'client_meta'

class ClientUserMapping(models.Model):
    client = models.ForeignKey(
        Clients, null=False, blank=False, on_delete=models.CASCADE)
    user = models.ForeignKey(
        user_model.CustomUser, on_delete=models.CASCADE, null=False, blank=False)
    created_on = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    last_updated_on = models.DateTimeField(auto_now=True, blank=False, null=False)
    # created_by = models.ForeignKey(
    #     user_model.CustomUser, related_name='client_user_map_created_by', null=False, blank=False, on_delete=models.CASCADE)
    # last_updated_by = models.ForeignKey(
    #     user_model.CustomUser, related_name='client_user_map_last_updated_by', null=False, blank=False, on_delete=models.CASCADE)

    class Meta:
        db_table = 'client_user_mapping'
        unique_together = ('client', 'user')

    def __str__(self):
        return "{} - {}".format(self.client, self.user)


class Services(models.Model):
    service_name = models.CharField(
        max_length=255, blank=False, null=False, unique=True)
    location = models.CharField(
        max_length=255, blank=True, null=True)
    created_on = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    last_updated_on = models.DateTimeField(auto_now=True, blank=False, null=False)
    created_by = models.ForeignKey(
        user_model.CustomUser, related_name='service_created_by', null=False, blank=False,
        on_delete=models.CASCADE)
    last_updated_by = models.ForeignKey(
        user_model.CustomUser, related_name='service_last_updated_by', null=False, blank=False,
        on_delete=models.CASCADE)
    class Meta:
        db_table = 'services'

    def __str__(self):
        return "{}".format(self.service_name)


class ServicesMeta(models.Model):
    service = models.ForeignKey(
        Services, null=False, blank=False, on_delete=models.CASCADE)
    meta_key = models.CharField(
        max_length=255, blank=False, null=False)
    meta_value = models.CharField(
        max_length=255, blank=False, null = False)
    created_on = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    last_updated_on = models.DateTimeField(auto_now=True, blank=False, null=False)
    created_by = models.ForeignKey(
        user_model.CustomUser, related_name='service_meta_created_by', null=False, blank=False, on_delete=models.CASCADE)
    last_updated_by = models.ForeignKey(
        user_model.CustomUser, related_name='service_meta_last_updated_by', null=False, blank=False,
        on_delete=models.CASCADE)

    class Meta:
        unique_together = ('service', 'meta_key')
        db_table = 'service_meta'

class UserServiceMapping(models.Model):
    service = models.ForeignKey(
        Services, null=False, blank=False, on_delete=models.CASCADE)
    user = models.ForeignKey(
        user_model.CustomUser, on_delete=models.CASCADE, null=False, blank=False)
    created_on = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    last_updated_on = models.DateTimeField(auto_now=True, blank=False, null=False)
    created_by = models.ForeignKey(
        user_model.CustomUser, related_name='user_service_map_created_by', null=False, blank=False, on_delete=models.CASCADE)
    last_updated_by = models.ForeignKey(
        user_model.CustomUser, related_name='user_service_map_last_updated_by', null=False, blank=False, on_delete=models.CASCADE)

    class Meta:
        db_table = 'user_service_mapping'
        unique_together = ('service', 'user')

    def __str__(self):
        return "{} - {}".format(self.user_username, self.service_name)


class Appointments(models.Model):
    date_created = models.DateTimeField(
        auto_now_add=True, blank=False, null=False)
    user = models.ForeignKey(
        user_model.CustomUser, on_delete=models.CASCADE, null=False, blank=False)
    client = models.ForeignKey(
        Clients, null=False, blank=False, on_delete=models.CASCADE)
    start_time = models.DateTimeField(blank=False, null=False)
    end_time = models.DateTimeField(blank=False, null=False)
    cancelled = models.BooleanField(default=False)
    cancellation_reason = models.CharField(
        max_length=255, blank=True, null=True)
    service = models.ForeignKey(
        Services, null=False, blank=False, on_delete=models.CASCADE)
    timezone_field = TimeZoneField(default='UTC', choices=[(tz, tz) for tz in pytz.all_timezones])
    notes = models.TextField(
        max_length=255, blank=True, null=True)
    lead_status = models.CharField(
        max_length=50, blank=False, null=False, default='Pending', choices = [
            ('Pending', 'Pending'),
            ('Closed', 'Closed'),
            ('Not Interested', 'Not Interested')
        ])
    event_identifier = models.CharField(
        max_length=255, blank=True, null=True, unique=False)
    created_on = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    last_updated_on = models.DateTimeField(auto_now=True, blank=False, null=False)

    class Meta:
        db_table = 'appointments'
        ordering = ['start_time']

    def __str__(self):
        return "{} - {}".format(self.start_time, self.end_time)