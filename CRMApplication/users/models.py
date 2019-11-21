from django.db import models
from django.contrib.auth.models import AbstractUser
from timezone_field import TimeZoneField
import pytz
from multiselectfield import MultiSelectField


class CustomUser(AbstractUser):
    user_mobile_number = models.CharField(
        max_length=25, unique=False, blank=False, null=False)
    email = models.EmailField('email address', unique=True, blank=False, null=False)
    last_updated_on = models.DateTimeField(auto_now=True, blank=False, null=False)
    profile_pic = models.FileField(upload_to='profile_pictures/users/', default="")

    def __str__(self):
        return self.username
    class Meta:
        db_table = 'users'


class Teams(models.Model):
    team_name = models.CharField(
        max_length=40, blank=False, null=False)
    profile_pic = models.FileField(upload_to='profile_pictures/teams/', default="")
    owner = models.ForeignKey(
        CustomUser, related_name='team_created_by', null=False, blank=False,
        on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    last_updated_on = models.DateTimeField(auto_now=True, blank=False, null=False)

    def __str__(self):
        return self.team_name

    class Meta:
        db_table = 'teams'
        verbose_name_plural = "Teams"


class TeamRoles(models.Model):
    role_name = models.CharField(
        max_length=40, blank=False, null=False, unique=True)
    created_on = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    last_updated_on = models.DateTimeField(auto_now=True, blank=False, null=False)
    created_by = models.ForeignKey(
        CustomUser, related_name='team_role_created_by', null=False, blank=False,
        on_delete=models.CASCADE)
    last_updated_by = models.ForeignKey(
        CustomUser, related_name='team_role_last_updated_by', null=False, blank=False,
        on_delete=models.CASCADE)

    def __str__(self):
        return self.role_name

    class Meta:
        db_table = 'team_roles'
        verbose_name_plural = "TeamRoles"


class UserTeamRoleMapping(models.Model):
    user = models.ForeignKey(
        CustomUser, null=False, blank=False, on_delete=models.CASCADE)
    team = models.ForeignKey(
        Teams, null=False, blank=False, on_delete=models.CASCADE)
    role = models.ForeignKey(
        TeamRoles, null=False, blank=False, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    last_updated_on = models.DateTimeField(auto_now=True, blank=False, null=False)
    created_by = models.ForeignKey(
        CustomUser, related_name='user_team_role_map_created_by', null=False, blank=False,
        on_delete=models.CASCADE)
    last_updated_by = models.ForeignKey(
        CustomUser, related_name='user_team_role_map_last_updated_by', null=False, blank=False,
        on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'team')
        db_table = 'user_team_role_mapping'
        verbose_name_plural = "UserTeamRoleMapping"


class UserPreferences(models.Model):
    user = models.OneToOneField(
        CustomUser, null=False, blank=False, on_delete=models.CASCADE)
    MON = "0"
    TUE = "1"
    WED = "2"
    THU = "3"
    FRI = "4"
    SAT = "5"
    SUN = "6"
    DAY_CHOICES = (
        (MON, 'Monday'),
        (TUE, 'Tuesday'),
        (WED, 'Wednesday'),
        (THU, 'Thursday'),
        (FRI, 'Friday'),
        (SAT, 'Saturday'),
        (SUN, 'Sunday'),
    )
    available_days = MultiSelectField(
        max_length=25, unique=False, blank=False, null=False, choices=DAY_CHOICES, default=["0", "1", "2", "3", "4"])
    available_from = models.TimeField(
        blank=False, null=False, default='09:0:00.000000')
    available_till = models.TimeField(
        blank=False, null=False, default='18:0:00.000000')
    timezone_field = TimeZoneField(default='UTC', choices=[(tz, tz) for tz in pytz.all_timezones])
    is_sms_preferred = models.BooleanField(default=False)
    is_mail_preferred = models.BooleanField(default=True)
    created_on = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    last_updated_on = models.DateTimeField(auto_now=True, blank=False, null=False)
    flag_view_as_team = models.BooleanField(default=False)

    def __str__(self):
        return "{}, {} , {}, {}".format(self.user, self.available_days, self.available_from, self.available_till)

    class Meta:
        db_table = 'user_preferences'


class UserMeta(models.Model):
    user = models.ForeignKey(
        CustomUser, null=False, blank=False, on_delete=models.CASCADE)
    meta_key = models.CharField(
        max_length=255, blank=False, null=False)
    meta_value = models.CharField(
        max_length=255, blank=False, null = False)
    created_on = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    last_updated_on = models.DateTimeField(auto_now=True, blank=False, null=False)

    class Meta:
        db_table = 'user_meta'
        unique_together = ('user', 'meta_key')

    def __str__(self):
        return "{} - {}".format(self.user, self.meta_key)


class TeamMeta(models.Model):
    team = models.ForeignKey(
        Teams, null=False, blank=False, on_delete=models.CASCADE)
    meta_key = models.CharField(
        max_length=255, blank=False, null=False)
    meta_value = models.CharField(
        max_length=255, blank=False, null = False)
    created_on = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    last_updated_on = models.DateTimeField(auto_now=True, blank=False, null=False)

    class Meta:
        db_table = 'team_meta'
        unique_together = ('team', 'meta_key')

    def __str__(self):
        return "{} - {}".format(self.team, self.meta_key)




