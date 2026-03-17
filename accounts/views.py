from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, redirect, render

from core.storefront import storefront_redirect
from .forms import AddressForm, ProfileForm, RegisterForm
from .models import Address, Profile, WishlistItem
from catalog.models import Product


def login_redirect(request):
	return storefront_redirect(request, '/account')


def logout_redirect(request):
	logout(request)
	return storefront_redirect(request, '/')


def register(request):
	return storefront_redirect(request, '/account')


@login_required
def dashboard(request):
	return storefront_redirect(request, '/account')


@login_required
def edit_profile(request):
	return storefront_redirect(request, '/account')


@login_required
def address_list(request):
	return storefront_redirect(request, '/account')


@login_required
def address_create(request):
	return storefront_redirect(request, '/account')


@login_required
def address_edit(request, pk):
	return storefront_redirect(request, '/account')


@login_required
def address_delete(request, pk):
	return storefront_redirect(request, '/account')


@login_required
def wishlist(request):
	return storefront_redirect(request, '/wishlist')


@login_required
def toggle_wishlist(request, product_id):
	if request.method != 'POST':
		return redirect(request.META.get('HTTP_REFERER', 'core:all_products'))

	product = get_object_or_404(Product, id=product_id, is_active=True)
	item, created = WishlistItem.objects.get_or_create(user=request.user, product=product)
	if not created:
		item.delete()
	return redirect(request.META.get('HTTP_REFERER', 'core:all_products'))


@login_required
def order_history(request):
	return storefront_redirect(request, '/account')
