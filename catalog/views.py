from django.shortcuts import render

from .services import CatalogService


def product_list(request, category_slug=None):
	context = CatalogService.get_listing_context(request.GET, category_slug=category_slug)
	return render(request, 'catalog/product_list.jinja', context)


def product_detail(request, slug):
	context = CatalogService.get_product_detail_context(slug)
	return render(request, 'catalog/product_detail.jinja', context)
