from django.contrib import admin

from .models import Address, Profile, WishlistItem


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
	list_display = ('user', 'phone', 'birth_date')
	search_fields = ('user__username', 'user__email', 'phone')


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
	list_display = ('user', 'title', 'city', 'country', 'is_default')
	list_filter = ('country', 'city', 'is_default')
	search_fields = ('user__username', 'full_name', 'phone')


@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
	list_display = ('user', 'product', 'added_at')
	search_fields = ('user__username', 'product__name')
