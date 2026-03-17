from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, redirect, render

from .forms import AddressForm, ProfileForm, RegisterForm
from .models import Address, Profile, WishlistItem
from catalog.models import Product


def register(request):
	form = RegisterForm(request.POST or None)
	if request.method == 'POST' and form.is_valid():
		user = form.save()
		Profile.objects.get_or_create(user=user)
		login(request, user)
		messages.success(request, 'Account created successfully.')
		return redirect('accounts:dashboard')
	return render(request, 'accounts/register.jinja', {'form': form})


@login_required
def dashboard(request):
	profile, _ = Profile.objects.get_or_create(user=request.user)
	recent_orders = request.user.orders.all()[:5]
	wishlist_items = request.user.wishlist_items.select_related('product')[:6]
	return render(
		request,
		'accounts/dashboard.jinja',
		{'profile': profile, 'recent_orders': recent_orders, 'wishlist_items': wishlist_items},
	)


@login_required
def edit_profile(request):
	profile, _ = Profile.objects.get_or_create(user=request.user)
	form = ProfileForm(request.POST or None, instance=profile)
	if request.method == 'POST' and form.is_valid():
		profile = form.save()
		request.user.first_name = form.cleaned_data['first_name']
		request.user.last_name = form.cleaned_data['last_name']
		request.user.email = form.cleaned_data['email']
		request.user.save()
		messages.success(request, 'Profile updated.')
		return redirect('accounts:dashboard')

	form.fields['first_name'].initial = request.user.first_name
	form.fields['last_name'].initial = request.user.last_name
	form.fields['email'].initial = request.user.email
	return render(request, 'accounts/edit_profile.jinja', {'form': form, 'profile': profile})


@login_required
def address_list(request):
	return render(request, 'accounts/address_list.jinja', {'addresses': request.user.addresses.all()})


@login_required
def address_create(request):
	form = AddressForm(request.POST or None)
	if request.method == 'POST' and form.is_valid():
		address = form.save(commit=False)
		address.user = request.user
		if address.is_default:
			Address.objects.filter(user=request.user, is_default=True).update(is_default=False)
		address.save()
		return redirect('accounts:address_list')
	return render(request, 'accounts/address_form.jinja', {'form': form, 'form_title': 'Add address'})


@login_required
def address_edit(request, pk):
	address = get_object_or_404(Address, pk=pk, user=request.user)
	form = AddressForm(request.POST or None, instance=address)
	if request.method == 'POST' and form.is_valid():
		address = form.save(commit=False)
		if address.is_default:
			Address.objects.filter(user=request.user, is_default=True).exclude(pk=address.pk).update(is_default=False)
		address.save()
		return redirect('accounts:address_list')
	return render(request, 'accounts/address_form.jinja', {'form': form, 'form_title': 'Edit address'})


@login_required
def address_delete(request, pk):
	address = get_object_or_404(Address, pk=pk, user=request.user)
	if request.method == 'POST':
		address.delete()
		return redirect('accounts:address_list')
	return render(request, 'accounts/address_delete.jinja', {'address': address})


@login_required
def wishlist(request):
	items = request.user.wishlist_items.select_related('product')
	return render(request, 'accounts/wishlist.jinja', {'items': items})


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
	orders = request.user.orders.prefetch_related('items', 'items__product')
	return render(request, 'accounts/order_history.jinja', {'orders': orders})
