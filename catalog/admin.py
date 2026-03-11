from django.contrib import admin

from .models import Brand, Category, Product, ProductImage, ProductVariation, Tag


class ProductImageInline(admin.TabularInline):
	model = ProductImage
	extra = 1


class ProductVariationInline(admin.TabularInline):
	model = ProductVariation
	extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
	list_display = ('name', 'sku', 'category', 'price', 'discounted_price', 'stock_quantity', 'is_active')
	list_filter = ('is_active', 'category', 'brand', 'tags')
	search_fields = ('name', 'sku')
	prepopulated_fields = {'slug': ('name',)}
	inlines = [ProductImageInline, ProductVariationInline]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
	list_display = ('name', 'parent', 'is_active')
	prepopulated_fields = {'slug': ('name',)}


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
	prepopulated_fields = {'slug': ('name',)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
	prepopulated_fields = {'slug': ('name',)}
