from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from django.core.exceptions import ValidationError

from cart.utils import get_or_create_cart
from core.storefront import storefront_redirect

from .forms import CheckoutForm
from .models import Order
from .services import CheckoutService


@login_required
def checkout(request):
	return storefront_redirect(request, '/checkout')


@login_required
def order_success(request, order_number):
	return storefront_redirect(request, '/account')
