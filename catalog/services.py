from django.db.models import Max, Min, Q
from django.shortcuts import get_object_or_404

from .models import Brand, Category, Product, Tag


class CatalogService:
    @staticmethod
    def get_listing_context(params, category_slug=None):
        categories = Category.objects.filter(is_active=True).prefetch_related('children')
        root_categories = categories.filter(parent__isnull=True)
        products = Product.objects.filter(is_active=True).select_related('category', 'brand').prefetch_related(
            'images', 'tags', 'attribute_values__attribute'
        )
        selected_category = None

        query = params.get('q', '').strip()
        selected_brand = params.get('brand', '').strip()
        selected_tags = params.getlist('tag')
        min_price = params.get('min_price', '').strip()
        max_price = params.get('max_price', '').strip()
        in_stock = params.get('in_stock') == '1'
        on_sale = params.get('on_sale') == '1'
        sort = params.get('sort', '').strip()

        if category_slug:
            selected_category = get_object_or_404(Category, slug=category_slug, is_active=True)
            category_ids = [selected_category.id, *selected_category.children.values_list('id', flat=True)]
            products = products.filter(category_id__in=category_ids)

        if query:
            products = products.filter(
                Q(name__icontains=query)
                | Q(short_description__icontains=query)
                | Q(description__icontains=query)
                | Q(sku__icontains=query)
                | Q(tags__name__icontains=query)
            ).distinct()

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
        else:
            products = products.order_by('-is_featured', '-created_at')

        category_scoped_products = products if selected_category else Product.objects.filter(is_active=True)
        brands = Brand.objects.filter(products__in=category_scoped_products).distinct().order_by('name')
        tags = Tag.objects.filter(product__in=category_scoped_products).distinct().order_by('name')
        price_range = category_scoped_products.aggregate(min_price=Min('price'), max_price=Max('price'))

        return {
            'categories': categories,
            'filter_categories': selected_category.children.filter(is_active=True) if selected_category else root_categories,
            'category_filter_title': selected_category.name if selected_category else None,
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
        }

    @staticmethod
    def get_product_detail_context(slug):
        product = get_object_or_404(
            Product.objects.prefetch_related(
                'images',
                'variations',
                'tags',
                'attribute_values__attribute',
                'reviews__user',
            ).select_related('category', 'brand'),
            slug=slug,
            is_active=True,
        )
        related_products = Product.objects.filter(is_active=True, category=product.category).exclude(id=product.id)[:6]
        approved_reviews = product.reviews.filter(is_approved=True)[:6]
        return {
            'product': product,
            'related_products': related_products,
            'approved_reviews': approved_reviews,
        }
