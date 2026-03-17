from django.contrib import admin

from .models import (
	Brand,
	Category,
	InventoryMovement,
	Product,
	ProductAttribute,
	ProductAttributeValue,
	ProductImage,
	ProductReview,
	ProductVariation,
	Tag,
)


class ProductImageInline(admin.TabularInline):
	model = ProductImage
	extra = 1


class ProductVariationInline(admin.TabularInline):
	model = ProductVariation
	extra = 1


class ProductAttributeValueInline(admin.TabularInline):
	model = ProductAttributeValue
	extra = 0


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
	list_display = ('name', 'sku', 'category', 'price', 'discounted_price', 'stock_quantity', 'rating_average', 'is_featured', 'is_active')
	list_filter = ('is_active', 'is_featured', 'category', 'brand', 'tags')
	search_fields = ('name', 'sku')
	prepopulated_fields = {'slug': ('name',)}
	inlines = [ProductImageInline, ProductVariationInline, ProductAttributeValueInline]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
	list_display = ('name', 'parent', 'sort_order', 'is_active')
	prepopulated_fields = {'slug': ('name',)}


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
	list_display = ('name', 'is_featured')
	prepopulated_fields = {'slug': ('name',)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
	prepopulated_fields = {'slug': ('name',)}


@admin.register(ProductAttribute)
class ProductAttributeAdmin(admin.ModelAdmin):
	list_display = ('name', 'code', 'is_filterable', 'is_variant_axis')
	prepopulated_fields = {'code': ('name',)}


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
	list_display = ('product', 'user', 'rating', 'is_approved', 'is_verified_purchase', 'created_at')
	list_filter = ('is_approved', 'is_verified_purchase', 'rating')
	search_fields = ('product__name', 'user__username', 'title')


@admin.register(InventoryMovement)
class InventoryMovementAdmin(admin.ModelAdmin):
	list_display = ('product', 'variation', 'movement_type', 'quantity', 'reference', 'created_at')
	list_filter = ('movement_type', 'created_at')
	search_fields = ('product__name', 'reference')
