from django.contrib import admin

from .models import Address, ProductQuestion, Profile, SupportTicket, WishlistItem


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
	list_display = ('user', 'phone', 'preferred_language', 'preferred_currency', 'privacy_mode_enabled')
	search_fields = ('user__username', 'user__email', 'phone')


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
	list_display = ('user', 'title', 'city', 'country', 'company_name', 'is_default')
	list_filter = ('country', 'city', 'is_default')
	search_fields = ('user__username', 'full_name', 'phone')


@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
	list_display = ('user', 'product', 'added_at')
	search_fields = ('user__username', 'product__name')


@admin.register(ProductQuestion)
class ProductQuestionAdmin(admin.ModelAdmin):
	list_display = ('user', 'product', 'created_at', 'updated_at')
	search_fields = ('user__username', 'product__name', 'question', 'answer')
	list_filter = ('created_at', 'updated_at')


@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
	list_display = ('user', 'subject', 'category', 'status', 'preferred_contact', 'created_at')
	search_fields = ('user__username', 'subject', 'message')
	list_filter = ('category', 'status', 'preferred_contact', 'created_at')
