import { cookies } from 'next/headers';

import { categories as fallbackCategories, featuredProducts as fallbackFeatured, getCategory as getFallbackCategory, getProduct as getFallbackProduct, getProductsByCategory as getFallbackProductsByCategory, newArrivals as fallbackNewArrivals, products as fallbackProducts, searchProducts, type Category, type Product } from '@/lib/data';

type ApiImage = {
  image: string;
  alt_text: string;
  is_primary: boolean;
};

type ApiVariation = {
  id: number;
  variation_type: string;
  value: string;
  title: string;
  price_delta: string;
  stock_override: number | null;
  is_default: boolean;
};

type ApiAttribute = {
  attribute: string;
  value: string;
  display_value: string;
};

type ApiProduct = {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  category: string;
  brand: string | null;
  brand_slug: string | null;
  sku: string;
  price: string;
  discounted_price: string | null;
  current_price: string;
  stock_quantity: number;
  rating_average: string;
  review_count: number;
  badge_text: string;
  is_discreet: boolean;
  attributes: ApiAttribute[];
  variations: ApiVariation[];
  images: ApiImage[];
};

type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  children?: ApiCategory[];
};

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type CartItemResponse = {
  id: number;
  quantity: number;
  unit_price: string;
  subtotal: string;
  variation_label: string;
  product: {
    id: number;
    name: string;
    slug: string;
    brand: string | null;
    current_price: string;
    badge_text: string;
    images: ApiImage[];
  };
};

export type CartResponse = {
  id: number;
  item_count: number;
  total: string;
  items: CartItemResponse[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL ?? 'http://127.0.0.1:8000/api';

function buildAbsoluteMedia(url?: string) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const origin = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${origin}${url.startsWith('/') ? url : `/${url}`}`;
}

function productUrgency(product: ApiProduct) {
  if (product.stock_quantity > 0 && product.stock_quantity <= 5) {
    return `Son ${product.stock_quantity} adet kaldı`;
  }
  if (product.discounted_price) {
    return 'Kampanya fiyatıyla satışta';
  }
  if (product.review_count > 20) {
    return `${product.review_count}+ kişi değerlendirdi`;
  }
  return 'Hızlı teslimat';
}

function mapProduct(product: ApiProduct): Product {
  const colors = product.variations
    .filter((variation) => variation.variation_type === 'color')
    .map((variation) => variation.title || variation.value);
  const sizes = product.variations
    .filter((variation) => variation.variation_type === 'size')
    .map((variation) => variation.title || variation.value);
  const bullets = product.attributes.length
    ? product.attributes.map((attribute) => attribute.display_value || `${attribute.attribute}: ${attribute.value}`)
    : [product.short_description || product.description.slice(0, 120)];

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand ?? 'AlbaniaShop',
    brandSlug: product.brand_slug ?? product.brand?.toLowerCase().replace(/\s+/g, '-') ?? '',
    category: product.category,
    price: Number(product.current_price),
    compareAtPrice: product.discounted_price ? Number(product.price) : undefined,
    rating: Number(product.rating_average || 0),
    reviewCount: product.review_count,
    stockLabel: product.stock_quantity > 0 ? (product.stock_quantity <= 5 ? 'Sınırlı Stok' : 'Stokta') : 'Tükendi',
    badge: product.badge_text || undefined,
    urgency: productUrgency(product),
    description: product.description || product.short_description,
    bullets,
    colors: colors.length ? colors : ['Standard'],
    sizes: sizes.length ? sizes : ['Standard'],
    images: product.images.length ? product.images.map((image) => buildAbsoluteMedia(image.image)) : fallbackProducts[0].images,
  };
}

function mapCategory(category: ApiCategory): Category {
  return {
    slug: category.slug,
    name: category.name,
    description: category.description || 'Yönetim panelinden yönetilen kategori.',
    highlight: category.description || `${category.name} ürünleri`,
    children: category.children?.length ? category.children.map(mapCategory) : undefined,
  };
}

async function safeFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionid')?.value;
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(sessionId ? { Cookie: `sessionid=${sessionId}` } : {}),
        ...(init?.headers ?? {}),
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return response.json() as Promise<T>;
  } catch {
    return null;
  }
}

function unwrapListResponse<T>(response: T[] | PaginatedResponse<T> | null) {
  if (!response) {
    return null;
  }

  return Array.isArray(response) ? response : response.results;
}

export async function getLiveCategories() {
  const response = unwrapListResponse(await safeFetch<ApiCategory[] | PaginatedResponse<ApiCategory>>('/catalog/categories/'));
  return response?.map(mapCategory) ?? fallbackCategories;
}

export async function getLiveProducts(query = '') {
  const suffix = query ? `/catalog/products/${query.startsWith('?') ? query : `?${query}`}` : '/catalog/products/';
  const response = unwrapListResponse(await safeFetch<ApiProduct[] | PaginatedResponse<ApiProduct>>(suffix));
  return response?.map(mapProduct) ?? fallbackProducts;
}

export async function getLiveFeaturedProducts() {
  const response = unwrapListResponse(await safeFetch<ApiProduct[] | PaginatedResponse<ApiProduct>>('/catalog/products/?is_featured=true'));
  return response?.map(mapProduct) ?? fallbackFeatured;
}

export async function getLiveNewArrivals() {
  const response = unwrapListResponse(await safeFetch<ApiProduct[] | PaginatedResponse<ApiProduct>>('/catalog/products/?ordering=-created_at'));
  return response?.map(mapProduct).slice(0, 4) ?? fallbackNewArrivals;
}

export async function getLiveProduct(slug: string) {
  const response = await safeFetch<ApiProduct>(`/catalog/products/${slug}/`);
  return response ? mapProduct(response) : getFallbackProduct(slug);
}

export async function getLiveCategoryProducts(slug: string) {
  const response = unwrapListResponse(await safeFetch<ApiProduct[] | PaginatedResponse<ApiProduct>>(`/catalog/products/?category__slug=${encodeURIComponent(slug)}`));
  return response?.map(mapProduct) ?? getFallbackProductsByCategory(slug);
}

export async function getLiveCategory(slug: string) {
  const categories = await getLiveCategories();
  return categories.find((category) => category.slug === slug) ?? getFallbackCategory(slug);
}

export async function getSearchResults(query: string) {
  const term = query.trim();
  if (!term) return fallbackProducts;
  const response = unwrapListResponse(await safeFetch<ApiProduct[] | PaginatedResponse<ApiProduct>>(`/catalog/products/?search=${encodeURIComponent(term)}`));
  return response?.map(mapProduct) ?? searchProducts(term);
}

export async function getCart() {
  return safeFetch<CartResponse>('/cart/');
}

// ── Brand API ─────────────────────────────────────────────────────

type ApiBrand = {
  id: number;
  name: string;
  slug: string;
  description: string;
};

export type BrandInfo = {
  name: string;
  slug: string;
  description: string;
};

export async function getLiveBrands(): Promise<BrandInfo[]> {
  const response = unwrapListResponse(await safeFetch<ApiBrand[] | PaginatedResponse<ApiBrand>>('/catalog/brands/'));
  return response?.map((b) => ({ name: b.name, slug: b.slug, description: b.description })) ?? [];
}

export async function getLiveBrand(slug: string): Promise<BrandInfo | null> {
  const response = await safeFetch<ApiBrand>(`/catalog/brands/${slug}/`);
  return response ? { name: response.name, slug: response.slug, description: response.description } : null;
}

export async function getLiveBrandProducts(slug: string): Promise<Product[]> {
  const response = unwrapListResponse(await safeFetch<ApiProduct[] | PaginatedResponse<ApiProduct>>(`/catalog/brands/${slug}/products/`));
  return response?.map(mapProduct) ?? [];
}

// ── Reviews API ───────────────────────────────────────────────────

export type LiveReview = {
  id: number;
  rating: number;
  title: string;
  comment: string;
  user_name: string;
  product_name: string;
  product_slug: string;
  is_verified_purchase: boolean;
  created_at: string;
};

export async function getLiveFeaturedReviews(): Promise<LiveReview[]> {
  const response = await safeFetch<LiveReview[]>('/catalog/reviews/featured/');
  return response ?? [];
}

export async function getLiveProductReviews(slug: string): Promise<LiveReview[]> {
  const response = unwrapListResponse(await safeFetch<LiveReview[] | PaginatedResponse<LiveReview>>(`/catalog/products/${slug}/reviews/`));
  return response ?? [];
}