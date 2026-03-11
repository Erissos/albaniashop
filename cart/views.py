from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render

from catalog.models import Product, ProductVariation

from .models import CartItem
from .utils import get_or_create_cart


def cart_detail(request):
	cart = get_or_create_cart(request)
	return render(request, 'cart/cart_detail.html', {'cart': cart})


def add_to_cart(request, product_id):
	cart = get_or_create_cart(request)
	product = get_object_or_404(Product, id=product_id, is_active=True)
	variation = None
	variation_id = request.POST.get('variation_id')
	if variation_id:
		variation = get_object_or_404(ProductVariation, id=variation_id, product=product)
	item, created = CartItem.objects.get_or_create(cart=cart, product=product, variation=variation)
	if not created:
		item.quantity += 1
		item.save(update_fields=['quantity'])
	messages.success(request, 'Product added to cart.')
	return redirect(request.META.get('HTTP_REFERER', 'cart:detail'))


def update_quantity(request, item_id):
	cart = get_or_create_cart(request)
	item = get_object_or_404(CartItem, id=item_id, cart=cart)
	action = request.POST.get('action')
	if action == 'increase':
		item.quantity += 1
		item.save(update_fields=['quantity'])
	elif action == 'decrease':
		item.quantity -= 1
		if item.quantity <= 0:
			item.delete()
		else:
			item.save(update_fields=['quantity'])
	return redirect('cart:detail')


def remove_from_cart(request, item_id):
	cart = get_or_create_cart(request)
	item = get_object_or_404(CartItem, id=item_id, cart=cart)
	item.delete()
	return redirect('cart:detail')
