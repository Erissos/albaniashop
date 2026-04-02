export type Category = {
  slug: string;
  name: string;
  description: string;
  highlight: string;
  children?: Category[];
};

export type Review = {
  name: string;
  city: string;
  rating: number;
  text: string;
  productName: string;
  productSlug: string;
};

export type ProductSpecItem = {
  label: string;
  value: string;
};

export type ProductVariationGroup = {
  name: string;
  values: string[];
};

export type ProductDetailGroup = {
  title: string;
  items: ProductSpecItem[];
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug?: string;
  isWishlisted?: boolean;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  stockLabel: string;
  badge?: string;
  urgency: string;
  shortDescription?: string;
  description: string;
  bullets: string[];
  colors: string[];
  sizes: string[];
  attributeRows?: ProductSpecItem[];
  variationGroups?: ProductVariationGroup[];
  detailGroups?: ProductDetailGroup[];
  images: string[];
};

export const categories: Category[] = [
  {
    slug: 'kadin',
    name: 'Kadın',
    description: 'Elbise, bluz, ayakkabı ve daha fazlası.',
    highlight: 'Kadın giyim ve aksesuar',
    children: [
      { slug: 'kadin-elbise', name: 'Elbise', description: '', highlight: '' },
      { slug: 'kadin-tisort', name: 'Tişört', description: '', highlight: '' },
      { slug: 'kadin-pantolon', name: 'Pantolon', description: '', highlight: '' },
      { slug: 'kadin-etek', name: 'Etek', description: '', highlight: '' },
      { slug: 'kadin-gomlek', name: 'Gömlek', description: '', highlight: '' },
      { slug: 'kadin-mont', name: 'Mont & Kaban', description: '', highlight: '' },
    ],
  },
  {
    slug: 'erkek',
    name: 'Erkek',
    description: 'Gömlek, pantolon, spor giyim ve aksesuar.',
    highlight: 'Erkek giyim ve aksesuar',
    children: [
      { slug: 'erkek-tisort', name: 'Tişört', description: '', highlight: '' },
      { slug: 'erkek-gomlek', name: 'Gömlek', description: '', highlight: '' },
      { slug: 'erkek-pantolon', name: 'Pantolon', description: '', highlight: '' },
      { slug: 'erkek-mont', name: 'Mont & Kaban', description: '', highlight: '' },
      { slug: 'erkek-takim-elbise', name: 'Takım Elbise', description: '', highlight: '' },
      { slug: 'erkek-sort', name: 'Şort', description: '', highlight: '' },
    ],
  },
  {
    slug: 'ev-yasam',
    name: 'Ev & Yaşam',
    description: 'Mobilya, dekorasyon, mutfak ürünleri.',
    highlight: 'Ev dekorasyon ve yaşam',
    children: [
      { slug: 'ev-dekorasyon', name: 'Dekorasyon', description: '', highlight: '' },
      { slug: 'ev-mutfak', name: 'Mutfak', description: '', highlight: '' },
      { slug: 'ev-banyo', name: 'Banyo', description: '', highlight: '' },
      { slug: 'ev-aydinlatma', name: 'Aydınlatma', description: '', highlight: '' },
      { slug: 'ev-tekstil', name: 'Ev Tekstili', description: '', highlight: '' },
    ],
  },
  {
    slug: 'kozmetik',
    name: 'Kozmetik',
    description: 'Makyaj, cilt bakımı, parfüm.',
    highlight: 'Güzellik ve kişisel bakım',
    children: [
      { slug: 'kozmetik-makyaj', name: 'Makyaj', description: '', highlight: '' },
      { slug: 'kozmetik-cilt-bakimi', name: 'Cilt Bakımı', description: '', highlight: '' },
      { slug: 'kozmetik-parfum', name: 'Parfüm', description: '', highlight: '' },
      { slug: 'kozmetik-sac-bakimi', name: 'Saç Bakımı', description: '', highlight: '' },
      { slug: 'kozmetik-kisisel-bakim', name: 'Kişisel Bakım', description: '', highlight: '' },
    ],
  },
  {
    slug: 'elektronik',
    name: 'Elektronik',
    description: 'Telefon, tablet, kulaklık, aksesuar.',
    highlight: 'Teknoloji ve elektronik',
    children: [
      { slug: 'elektronik-telefon', name: 'Telefon', description: '', highlight: '' },
      { slug: 'elektronik-tablet', name: 'Tablet', description: '', highlight: '' },
      { slug: 'elektronik-kulaklik', name: 'Kulaklık', description: '', highlight: '' },
      { slug: 'elektronik-aksesuar', name: 'Aksesuar', description: '', highlight: '' },
      { slug: 'elektronik-bilgisayar', name: 'Bilgisayar', description: '', highlight: '' },
    ],
  },
  {
    slug: 'ayakkabi-canta',
    name: 'Ayakkabı & Çanta',
    description: 'Spor, günlük, klasik ayakkabı ve çantalar.',
    highlight: 'Ayakkabı ve çanta modelleri',
    children: [
      { slug: 'ayakkabi-spor', name: 'Spor Ayakkabı', description: '', highlight: '' },
      { slug: 'ayakkabi-gunluk', name: 'Günlük Ayakkabı', description: '', highlight: '' },
      { slug: 'ayakkabi-topuklu', name: 'Topuklu', description: '', highlight: '' },
      { slug: 'canta-kol', name: 'Kol Çantası', description: '', highlight: '' },
      { slug: 'canta-sirt', name: 'Sırt Çantası', description: '', highlight: '' },
    ],
  },
  {
    slug: 'anne-cocuk',
    name: 'Anne & Çocuk',
    description: 'Bebek giyim, oyuncak, anne bakım.',
    highlight: 'Anne ve çocuk ürünleri',
    children: [
      { slug: 'bebek-giyim', name: 'Bebek Giyim', description: '', highlight: '' },
      { slug: 'cocuk-giyim', name: 'Çocuk Giyim', description: '', highlight: '' },
      { slug: 'oyuncak', name: 'Oyuncak', description: '', highlight: '' },
      { slug: 'anne-bakim', name: 'Anne Bakım', description: '', highlight: '' },
      { slug: 'bebek-bakim', name: 'Bebek Bakım', description: '', highlight: '' },
    ],
  },
  {
    slug: 'spor-outdoor',
    name: 'Spor & Outdoor',
    description: 'Spor giyim, fitness ekipmanları.',
    highlight: 'Spor ve outdoor ürünleri',
    children: [
      { slug: 'spor-giyim', name: 'Spor Giyim', description: '', highlight: '' },
      { slug: 'fitness', name: 'Fitness', description: '', highlight: '' },
      { slug: 'outdoor', name: 'Outdoor', description: '', highlight: '' },
      { slug: 'kamp', name: 'Kamp', description: '', highlight: '' },
      { slug: 'bisiklet', name: 'Bisiklet', description: '', highlight: '' },
    ],
  },
];

export const products: Product[] = [
  {
    id: 1,
    slug: 'pamuklu-oversize-tisort',
    name: 'Pamuklu Oversize Tişört',
    brand: 'Koton',
    brandSlug: 'koton',
    category: 'kadin',
    price: 2990,
    compareAtPrice: 4990,
    rating: 4.7,
    reviewCount: 1284,
    stockLabel: 'Stokta',
    badge: 'Çok Satan',
    urgency: 'Son 24 saatte 340 kişi aldı',
    description: 'Rahat kesim, saf pamuklu oversize tişört. Günlük kullanım için ideal.',
    bullets: ['%100 Pamuk', 'Oversize kalıp', 'Nefes alabilir kumaş'],
    colors: ['Beyaz', 'Siyah', 'Bej'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 2,
    slug: 'seramik-vazo-seti',
    name: 'Seramik Vazo Seti (3lü)',
    brand: 'Madame Coco',
    brandSlug: 'madame-coco',
    category: 'ev-yasam',
    price: 8990,
    compareAtPrice: 12990,
    rating: 4.8,
    reviewCount: 567,
    stockLabel: 'Stokta',
    badge: 'Fırsat',
    urgency: 'Sınırlı stok',
    description: 'El yapımı seramik vazo seti. Modern ve minimalist tasarım.',
    bullets: ['El yapımı seramik', 'Minimalist tasarım', '3lü set'],
    colors: ['Krem', 'Gri'],
    sizes: ['Standart'],
    images: [
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507652955-f3dcef5a3be5?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 3,
    slug: 'nemlendirici-krem-spf50',
    name: 'Günlük Nemlendirici Krem SPF50',
    brand: 'Farmasi',
    brandSlug: 'farmasi',
    category: 'kozmetik',
    price: 3490,
    rating: 4.9,
    reviewCount: 2103,
    stockLabel: 'Stokta',
    badge: 'Çok Satan',
    urgency: 'Bu ay 5.000+ satıldı',
    description: 'SPF50 korumalı, hafif formüllü günlük nemlendirici.',
    bullets: ['SPF50 koruma', 'Hafif formül', 'Tüm cilt tiplerine uygun'],
    colors: ['Standart'],
    sizes: ['50 ml', '100 ml'],
    images: [
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 4,
    slug: 'slim-fit-chino-pantolon',
    name: 'Slim Fit Chino Pantolon',
    brand: 'DeFacto',
    brandSlug: 'defacto',
    category: 'erkek',
    price: 4490,
    compareAtPrice: 5990,
    rating: 4.5,
    reviewCount: 892,
    stockLabel: 'Stokta',
    urgency: 'Hızlı teslimat',
    description: 'Esnek kumaşlı, slim fit chino pantolon.',
    bullets: ['Esnek kumaş', 'Slim fit kalıp', 'Cep detayları'],
    colors: ['Lacivert', 'Haki', 'Siyah'],
    sizes: ['28', '30', '32', '34'],
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 5,
    slug: 'bluetooth-kulaklik',
    name: 'Kablosuz Bluetooth Kulaklık',
    brand: 'JBL',
    brandSlug: 'jbl',
    category: 'elektronik',
    price: 14990,
    compareAtPrice: 19990,
    rating: 4.6,
    reviewCount: 3412,
    stockLabel: 'Stokta',
    badge: 'Süper Fiyat',
    urgency: 'Son 5 adet kaldı',
    description: 'Aktif gürültü engelleme, 30 saat pil ömrü.',
    bullets: ['Aktif gürültü engelleme', '30 saat pil ömrü', 'Katlanabilir tasarım'],
    colors: ['Siyah', 'Beyaz'],
    sizes: ['Standart'],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 6,
    slug: 'pamuk-nevresim-takimi',
    name: 'Pamuk Saten Nevresim Takımı',
    brand: 'English Home',
    brandSlug: 'english-home',
    category: 'ev-yasam',
    price: 11990,
    compareAtPrice: 16990,
    rating: 4.8,
    reviewCount: 456,
    stockLabel: 'Stokta',
    badge: 'İndirim',
    urgency: 'Sepette ekstra %10 indirim',
    description: 'Saf pamuk saten, çift kişilik nevresim takımı.',
    bullets: ['%100 Pamuk saten', 'Çift kişilik', 'Oeko-Tex sertifikalı'],
    colors: ['Beyaz', 'Pudra'],
    sizes: ['Çift Kişilik'],
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 7,
    slug: 'spor-sneaker-ayakkabi',
    name: 'Günlük Spor Sneaker',
    brand: 'Nike',
    brandSlug: 'nike',
    category: 'ayakkabi-canta',
    price: 17990,
    compareAtPrice: 22990,
    rating: 4.7,
    reviewCount: 1879,
    stockLabel: 'Stokta',
    badge: 'Popüler',
    urgency: 'Hızlı tükeniyor',
    description: 'Hafif taban, nefes alabilir üst malzeme.',
    bullets: ['Hafif taban', 'Nefes alabilir', 'Günlük kullanım'],
    colors: ['Beyaz', 'Siyah', 'Gri'],
    sizes: ['38', '39', '40', '41', '42', '43'],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 8,
    slug: 'organik-bebek-tulumu',
    name: 'Organik Pamuk Bebek Tulumu',
    brand: 'LC Waikiki',
    brandSlug: 'lc-waikiki',
    category: 'anne-cocuk',
    price: 1990,
    compareAtPrice: 2990,
    rating: 4.9,
    reviewCount: 678,
    stockLabel: 'Stokta',
    badge: 'Yeni',
    urgency: 'Yeni sezon ürünü',
    description: 'Organik pamuklu, hipoalerjenik bebek tulumu.',
    bullets: ['Organik pamuk', 'Hipoalerjenik', 'Çıtçıt kapamalı'],
    colors: ['Pembe', 'Mavi', 'Krem'],
    sizes: ['0-3 Ay', '3-6 Ay', '6-9 Ay'],
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

export const reviews: Review[] = [
  {
    name: 'Ayşe K.',
    city: 'İstanbul',
    rating: 5,
    text: 'Ürün tam beklediğim gibi geldi. Kumaş kalitesi çok iyi, kargo da hızlıydı.',
    productName: 'Pamuklu Oversize Tişört',
    productSlug: 'pamuklu-oversize-tisort',
  },
  {
    name: 'Mehmet D.',
    city: 'Ankara',
    rating: 5,
    text: 'Fiyat/performans olarak çok memnun kaldım. Kesinlikle tekrar alışveriş yapacağım.',
    productName: 'Slim Fit Chino Pantolon',
    productSlug: 'slim-fit-chino-pantolon',
  },
  {
    name: 'Zeynep A.',
    city: 'İzmir',
    rating: 4,
    text: 'Ürün kaliteli ve paketleme özenli. Teslimat süresi de gayet makuldü.',
    productName: 'Günlük Nemlendirici Krem SPF50',
    productSlug: 'nemlendirici-krem-spf50',
  },
];

export const trustSignals = [
  'Güvenli ödeme',
  'Hızlı kargo (1-3 iş günü)',
  '14 gün koşulsuz iade',
  '7/24 müşteri desteği',
];

export const editorialStats = [
  { label: 'Ürün çeşidi', value: '50K+' },
  { label: 'Mutlu müşteri', value: '2M+' },
  { label: 'Marka', value: '5K+' },
  { label: 'Ortalama puan', value: '4.7/5' },
];

export const cartItems = [
  { product: products[0], quantity: 1 },
  { product: products[2], quantity: 1 },
];

export const featuredProducts = products.slice(0, 4);
export const newArrivals = products.slice(4, 8);

export function formatLek(value: number) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((product) => product.category === slug);
}

export function searchProducts(query: string) {
  const term = query.trim().toLowerCase();
  if (!term) return products;

  return products.filter((product) => {
    const haystack = [product.name, product.brand, product.category, product.description].join(' ').toLowerCase();
    return haystack.includes(term);
  });
}

export function getCartTotal() {
  return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
}