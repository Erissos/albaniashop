from pages.models import SiteSetting
from catalog.models import Category


def site_settings(request):
    settings_obj = SiteSetting.objects.first()
    header_categories = Category.objects.filter(parent__isnull=True, is_active=True).prefetch_related('children')[:8]
    return {'site_settings': settings_obj, 'header_categories': header_categories}
