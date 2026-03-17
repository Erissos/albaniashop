from django.shortcuts import render

from catalog.services import CatalogService

from .services import HomePageService


def home(request):
	return render(request, 'core/home.jinja', HomePageService.get_home_context())


def all_products(request):
	context = CatalogService.get_listing_context(request.GET)
	context['selected_category'] = None
	return render(request, 'catalog/product_list.jinja', context)
