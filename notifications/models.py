from django.conf import settings
from django.db import models


class NotificationTemplate(models.Model):
    class Channel(models.TextChoices):
        EMAIL = 'email', 'Email'
        SMS = 'sms', 'SMS'
        PUSH = 'push', 'Push'

    key = models.CharField(max_length=80, unique=True)
    channel = models.CharField(max_length=20, choices=Channel.choices)
    subject_template = models.CharField(max_length=160, blank=True)
    body_template = models.TextField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.key


class NotificationLog(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        SENT = 'sent', 'Sent'
        FAILED = 'failed', 'Failed'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='notification_logs', on_delete=models.CASCADE, null=True, blank=True)
    template = models.ForeignKey(NotificationTemplate, related_name='logs', on_delete=models.SET_NULL, null=True, blank=True)
    channel = models.CharField(max_length=20, choices=NotificationTemplate.Channel.choices)
    recipient = models.CharField(max_length=160)
    subject = models.CharField(max_length=160, blank=True)
    payload = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    provider_reference = models.CharField(max_length=120, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.channel} -> {self.recipient}'
