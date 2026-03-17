from catalog.models import Brand, Category, Product


class HomePageService:
    @staticmethod
    def get_home_context():
        featured_products = Product.objects.filter(is_active=True, is_featured=True).prefetch_related('images')[:8]
        campaign_products = Product.objects.filter(is_active=True, discounted_price__isnull=False).prefetch_related('images')[:8]
        new_arrivals = Product.objects.filter(is_active=True).prefetch_related('images').order_by('-created_at')[:12]
        partner_brands = Brand.objects.filter(is_featured=True)[:8]
        root_categories = Category.objects.filter(parent__isnull=True, is_active=True).prefetch_related('children')
        featured_categories = []

        for category in root_categories[:8]:
            category_product = (
                category.products.filter(is_active=True)
                .prefetch_related('images')
                .first()
            )
            category_image = None

            if category_product:
                category_image = category_product.images.filter(is_primary=True).first()
                if category_image is None:
                    category_image = category_product.images.first()

            featured_categories.append(
                {
                    'name': category.name,
                    'slug': category.slug,
                    'image': category_image,
                    'product_count': category.products.filter(is_active=True).count(),
                }
            )

        hero_metrics = [
            {'value': Product.objects.filter(is_active=True).count(), 'label': 'produkte aktive'},
            {'value': Brand.objects.count(), 'label': 'brende partnere'},
            {'value': Category.objects.filter(is_active=True).count(), 'label': 'kategori'},
        ]

        trust_markers = [
            'Paketim diskret për çdo porosi',
            'Pagesa të sigurta dhe të mbrojtura',
            'Llogari private me histori porosish',
        ]
        return {
            'featured_products': featured_products,
            'campaign_products': campaign_products,
            'new_arrivals': new_arrivals,
            'partner_brands': partner_brands,
            'root_categories': root_categories,
            'featured_categories': featured_categories,
            'hero_metrics': hero_metrics,
            'trust_markers': trust_markers,
        }
