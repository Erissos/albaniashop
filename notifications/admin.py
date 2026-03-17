from django.contrib import admin

from .models import NotificationLog, NotificationTemplate


@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    list_display = ('key', 'channel', 'is_active')
    list_filter = ('channel', 'is_active')
    search_fields = ('key', 'subject_template')


@admin.register(NotificationLog)
class NotificationLogAdmin(admin.ModelAdmin):
    list_display = ('channel', 'recipient', 'status', 'created_at')
    list_filter = ('channel', 'status', 'created_at')
    search_fields = ('recipient', 'subject', 'provider_reference')
