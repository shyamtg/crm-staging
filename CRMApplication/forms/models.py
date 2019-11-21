from django.db import models
from users import models as user_model
from django_mysql.models import JSONField


class Forms(models.Model):
    form_name = models.CharField(
        max_length=50, blank=False, null=False, unique=True)
    form_owner = models.ForeignKey(
        user_model.CustomUser, on_delete=models.CASCADE, null=False, blank=False)
    form_fields = models.TextField(blank=True, null=True)
    created_on = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    last_updated_on = models.DateTimeField(auto_now=True, blank=False, null=False)

    class Meta:
        db_table = 'forms'

    def __str__(self):
        return "{}".format(self.form_name)


class UserFormMapping(models.Model):
    form = models.ForeignKey(
        Forms, on_delete=models.CASCADE, null=False, blank=False)
    user = models.ForeignKey(
        user_model.CustomUser, on_delete=models.CASCADE, null=False, blank=False)
    created_on = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    last_updated_on = models.DateTimeField(auto_now=True, blank=False, null=False)

    class Meta:
        unique_together = ('form', 'user')
        db_table = 'user_form_mapping'
        ordering = ['-last_updated_on']

    def __str__(self):
        return "{} - {}".format(self.form, self.user)


class FormData(models.Model):
    form = models.ForeignKey(
        Forms, on_delete=models.CASCADE, null=False, blank=False)
    user = models.ForeignKey(
        user_model.CustomUser, on_delete=models.CASCADE, null=False, blank=False)
    friendly_name = models.CharField(max_length=50, blank=False, null=False)
    status = models.CharField(
        max_length=20, blank=False, null=False, default='draft', choices=[
            ('draft', 'draft'),
            ('submit', 'submit')])
    form_data = JSONField()
    created_on = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    last_updated_on = models.DateTimeField(auto_now=True, blank=False, null=False)

    class Meta:
        db_table = 'form_data'

    def __str__(self):
        return "{}".format(self.form_data)

