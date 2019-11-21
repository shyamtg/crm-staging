from celery import shared_task, Celery
from . import gcal
celery = Celery('tasks', broker='amqp://guest@localhost//')
from appointments import models
from django.core.serializers.json import DjangoJSONEncoder
import json
from django.core import serializers


@shared_task
def send_email(appt_id):
    """
    Sends email for appointment booked and map the event ID in appointment table
    :param appt_id: Appointment ID for which invite to be sent
    """
    appointment_instance = models.Appointments.objects.get(id=appt_id)
    # serialize the appointment instance
    serialized_obj = json.loads(serializers.serialize('json', [appointment_instance, ]))
    email_dict = {
        'notes': appointment_instance.notes,
        'start_time': serialized_obj[0]['fields']['start_time'],
        'end_time': serialized_obj[0]['fields']['end_time'],
        'client': {
            'name': appointment_instance.client.client_name,
            'email': appointment_instance.client.client_email_id},
        'service': appointment_instance.service.service_name,
        'users': [{
            'name': appointment_instance.user.username,
            'email': appointment_instance.user.email,
        }]
    }
    event_identifier = gcal.send_invite_through_gcal(email_dict)
    models.Appointments.objects.filter(id=appt_id).update(event_identifier=event_identifier)

@shared_task
def send_update_email(appt_id, event_id):
    """
    Sends reschedule email
    :param appt_id: Appointment ID for which invite to be sent
    :param event_id: Event / Invite ID to be rescheduled
    """
    appointment_instance = models.Appointments.objects.get(id=appt_id)
    # serialize the appointment instance
    serialized_obj = json.loads(serializers.serialize('json', [appointment_instance, ]))
    email_dict = {}
    email_dict.update({
        'start_time': serialized_obj[0]['fields']['start_time'],
        'end_time': serialized_obj[0]['fields']['end_time'],
        'notes': appointment_instance.notes,
        'service': appointment_instance.service.service_name,
        'cancellation_reason': appointment_instance.cancellation_reason,
        'client': {
            'name': appointment_instance.client.client_name,
            'email': appointment_instance.client.client_email_id},
        'users': [{
            'name': appointment_instance.user.username,
            'email': appointment_instance.user.email,
        }]
    })
    print (event_id)
    if appointment_instance.cancelled:
        gcal.cancel_invite_through_gcal(email_dict, event_id)
    else:
        gcal.update_invite_through_gcal(email_dict, event_id)
