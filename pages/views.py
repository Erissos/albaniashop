from django.contrib import messages
from django.shortcuts import render

from core.storefront import storefront_redirect
from orders.models import ShipmentTracking

from .forms import ContactForm


def about(request):
	return storefront_redirect(request, '/')


def contracts(request):
	return storefront_redirect(request, '/')


def contact(request):
	return storefront_redirect(request, '/')


def cargo_tracking(request):
	return storefront_redirect(request, '/')
