from django.contrib import admin

from .models import ContactMessage, SiteSetting, StaticPage


@admin.register(StaticPage)
class StaticPageAdmin(admin.ModelAdmin):
	list_display = ('title', 'slug', 'is_published', 'updated_at')
	prepopulated_fields = {'slug': ('title',)}


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
	list_display = ('name', 'email', 'subject', 'created_at', 'is_read')
	list_filter = ('is_read', 'created_at')
	search_fields = ('name', 'email', 'subject')


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
	list_display = ('site_name', 'email', 'phone', 'whatsapp_number')
