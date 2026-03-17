from django.contrib import messages
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404, redirect, render

from catalog.models import Product, ProductVariation

from .services import CartService
from .models import CartItem
from .utils import get_or_create_cart


def cart_detail(request):
	cart = get_or_create_cart(request)
	cart_items = cart.items.select_related('product', 'variation')
	return render(request, 'cart/cart_detail.jinja', {'cart': cart, 'cart_items': cart_items})


def add_to_cart(request, product_id):
	cart = get_or_create_cart(request)
	product = get_object_or_404(Product, id=product_id, is_active=True)
	variation = None
	variation_id = request.POST.get('variation_id')
	if variation_id:
		variation = get_object_or_404(ProductVariation, id=variation_id, product=product)
	try:
		CartService.add_item(cart, product, variation=variation, quantity=1)
		messages.success(request, 'Product added to cart.')
	except ValidationError as exc:
		messages.error(request, exc.message)
	return redirect(request.META.get('HTTP_REFERER', 'cart:detail'))


def update_quantity(request, item_id):
	cart = get_or_create_cart(request)
	item = get_object_or_404(CartItem, id=item_id, cart=cart)
	action = request.POST.get('action')
	CartService.update_item_quantity(item, action)
	return redirect('cart:detail')


def remove_from_cart(request, item_id):
	cart = get_or_create_cart(request)
	item = get_object_or_404(CartItem, id=item_id, cart=cart)
	item.delete()
	return redirect('cart:detail')
