from django.db.models import Min, Max, Q
from django.shortcuts import get_object_or_404, render

from .models import Brand, Category, Product, Tag


def product_list(request, category_slug=None):
	categories = Category.objects.filter(is_active=True)
	root_categories = categories.filter(parent__isnull=True)
	products = Product.objects.filter(is_active=True).select_related('category', 'brand').prefetch_related('images', 'tags')
	selected_category = None

	query = request.GET.get('q', '').strip()
	selected_brand = request.GET.get('brand', '').strip()
	selected_tags = request.GET.getlist('tag')
	min_price = request.GET.get('min_price', '').strip()
	max_price = request.GET.get('max_price', '').strip()
	in_stock = request.GET.get('in_stock') == '1'
	on_sale = request.GET.get('on_sale') == '1'
	sort = request.GET.get('sort', '').strip()

	if category_slug:
		selected_category = get_object_or_404(Category, slug=category_slug)
		category_ids = [selected_category.id, *selected_category.children.values_list('id', flat=True)]
		products = products.filter(category_id__in=category_ids)

	if selected_category:
		child_categories = selected_category.children.filter(is_active=True)
		if child_categories.exists():
			filter_categories = child_categories
			category_filter_title = selected_category.name
		elif selected_category.parent_id:
			filter_categories = selected_category.parent.children.filter(is_active=True)
			category_filter_title = selected_category.parent.name
		else:
			filter_categories = root_categories
			category_filter_title = None
	else:
		filter_categories = root_categories
		category_filter_title = None

	category_scoped_products = products
	brands = Brand.objects.filter(products__in=category_scoped_products, products__is_active=True).distinct().order_by('name')
	tags = Tag.objects.filter(product__in=category_scoped_products).distinct().order_by('name')
	price_range = category_scoped_products.aggregate(min_price=Min('price'), max_price=Max('price'))

	if query:
		products = products.filter(
			Q(name__icontains=query)
			| Q(short_description__icontains=query)
			| Q(description__icontains=query)
			| Q(sku__icontains=query)
		)

	if selected_brand:
		products = products.filter(brand__slug=selected_brand)

	if selected_tags:
		products = products.filter(tags__slug__in=selected_tags).distinct()

	if min_price:
		products = products.filter(price__gte=min_price)

	if max_price:
		products = products.filter(price__lte=max_price)

	if in_stock:
		products = products.filter(stock_quantity__gt=0)

	if on_sale:
		products = products.filter(discounted_price__isnull=False)

	if sort == 'price_asc':
		products = products.order_by('price')
	elif sort == 'price_desc':
		products = products.order_by('-price')
	elif sort == 'name_asc':
		products = products.order_by('name')
	elif sort == 'newest':
		products = products.order_by('-created_at')

	return render(
		request,
		'catalog/product_list.html',
		{
			'categories': categories,
			'filter_categories': filter_categories,
			'category_filter_title': category_filter_title,
			'brands': brands,
			'tags': tags,
			'products': products,
			'selected_category': selected_category,
			'query': query,
			'selected_brand': selected_brand,
			'selected_tags': selected_tags,
			'min_price': min_price,
			'max_price': max_price,
			'in_stock': in_stock,
			'on_sale': on_sale,
			'price_range': price_range,
			'product_count': products.count(),
			'sort': sort,
		},
	)


def product_detail(request, slug):
	product = get_object_or_404(
		Product.objects.prefetch_related('images', 'variations', 'tags').select_related('category', 'brand'),
		slug=slug,
		is_active=True,
	)
	related_products = Product.objects.filter(is_active=True, category=product.category).exclude(id=product.id)[:6]
	return render(request, 'catalog/product_detail.html', {'product': product, 'related_products': related_products})
