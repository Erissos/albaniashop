# 🛒 AlbaniaShop — E-Ticaret Platformu

Modern, tam özellikli bir e-ticaret platformu. **Django REST** backend ve **Next.js** frontend ile geliştirilmiştir.

---

## 📋 İçindekiler

- [Teknoloji Yığını](#-teknoloji-yığını)
- [Özellikler](#-özellikler)
- [Proje Yapısı](#-proje-yapısı)
- [Kurulum](#-kurulum)
  - [Gereksinimler](#gereksinimler)
  - [Yerel Geliştirme](#yerel-geliştirme)
  - [Docker ile Kurulum](#docker-ile-kurulum)
- [API Endpoints](#-api-endpoints)
- [Ortam Değişkenleri](#-ortam-değişkenleri)
- [Deployment](#-deployment)

---

## 🧰 Teknoloji Yığını

| Katman       | Teknolojiler                                                  |
| ------------ | ------------------------------------------------------------- |
| **Backend**  | Django 5.1, Django REST Framework 3.15, Gunicorn, Jinja2      |
| **Frontend** | Next.js 15, React 19, TypeScript 5.8, Tailwind CSS 3.4        |
| **Veritabanı** | PostgreSQL 16 (prod) / SQLite (dev)                        |
| **Önbellek** | Redis 7                                                       |
| **Altyapı**  | Docker, Docker Compose, WhiteNoise                            |

---

## ✨ Özellikler

### Ürün Kataloğu
- İç içe kategoriler (SEO meta verileriyle)
- Marka yönetimi ve öne çıkan ürün vitrinleri
- Ürün varyantları (renk, beden) — fiyat farkı desteği
- Esnek, filtrelenebilir ürün özellikleri
- Stok takibi ve güvenlik eşikleri
- Envanter hareketi denetim kaydı
- Moderasyonlu ürün yorumları (doğrulanmış satın alma)

### Alışveriş Deneyimi
- Sepet (kullanıcı + anonim oturum desteği)
- İstek listesi
- Tam metin ürün arama (ad, açıklama, SKU, etiket)
- Filtreleme (kategori, marka, öne çıkan)
- Sıralama (tarih, fiyat, puan)

### Kullanıcı Hesapları
- Kayıt & giriş
- Çoklu adres yönetimi
- Gizlilik tercihleri (anonim paketleme, gizli mod)
- Pazarlama izinleri
- Dil & para birimi tercihleri
- Sipariş geçmişi

### Sipariş & Ödeme
- Sipariş oluşturma ve satır kalemleri
- Ödeme durumu takibi (beklemede, yetkilendirildi, ödendi, başarısız, iade)
- Sipariş yaşam döngüsü (beklemede → ödendi → işleniyor → kargoda → teslim edildi)
- Kargo takibi (takip kodu, kargo firması, tahmini teslimat)
- Sipariş olay zaman çizelgesi
- Vergi, kargo ve indirim dökümü

### Promosyonlar
- Kupon kodları (sabit tutar, yüzde, ücretsiz kargo)
- Tarih aralığı geçerliliği
- Kullanım limitleri ve kullanım takibi
- Minimum sipariş tutarı ve maksimum indirim tavanı

### Bildirimler
- Çok kanallı bildirim desteği (e-posta, SMS, push)
- Yeniden kullanılabilir şablonlar (değişken desteği)
- Teslimat günlüğü ve durum izleme

### Sayfalar & CMS
- Statik sayfalar (içerik, SEO)
- İletişim formu
- Site ayarları (ad, iletişim bilgisi, WhatsApp)

---

## 📁 Proje Yapısı

```
albaniashop/
├── config/              # Django proje ayarları, URL yapılandırması
├── core/                # Site geneli yapılandırmalar, storefront servisleri
├── catalog/             # Ürün, kategori, marka, etiket, varyant, yorum
├── accounts/            # Kullanıcı profili, adresler, istek listesi
├── cart/                # Sepet yönetimi (kullanıcı + anonim)
├── orders/              # Sipariş, ödeme, kargo takibi
├── promotions/          # Kupon kodları ve indirim yönetimi
├── notifications/       # E-posta, SMS, push bildirim sistemi
├── pages/               # Statik sayfalar, iletişim formu, site ayarları
├── api/                 # REST API endpoint tanımları
├── frontend/            # Next.js 15 frontend uygulaması
│   ├── app/             # App Router sayfa yapısı
│   ├── components/      # React bileşenleri
│   └── lib/             # API istemcisi ve yardımcı fonksiyonlar
├── docs/                # Mimari ve deployment dökümanları
├── locale/              # Çeviri dosyaları (TR, EN)
├── media/               # Yüklenen medya dosyaları
├── static/              # Statik dosyalar (CSS, JS)
├── docker-compose.yml   # Docker servisleri
├── Dockerfile           # Multi-stage Docker build
├── manage.py            # Django yönetim betiği
└── requirements.txt     # Python bağımlılıkları
```

---

## 🚀 Kurulum

### Gereksinimler

- Python 3.12+
- Node.js 18+
- PostgreSQL 16 (production) veya SQLite (development)
- Redis 7 (önbellek ve oturum yönetimi)

### Yerel Geliştirme

**1. Backend (Django)**

```bash
# Sanal ortam oluştur ve aktifleştir
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

# Bağımlılıkları kur
pip install -r requirements.txt

# Veritabanı migration'larını çalıştır
python manage.py migrate

# Süper kullanıcı oluştur
python manage.py createsuperuser

# Geliştirme sunucusunu başlat (port 8000)
python manage.py runserver
```

**2. Frontend (Next.js)**

```bash
cd frontend

# Bağımlılıkları kur
npm install

# Geliştirme sunucusunu başlat (port 3000)
npm run dev
```

Uygulama şu adreslerde erişilebilir olacaktır:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api/
- **Admin Paneli:** http://localhost:8000/admin/

### Docker ile Kurulum

```bash
# Tüm servisleri başlat (Django + PostgreSQL + Redis)
docker-compose up --build

# Migration'ları çalıştır
docker-compose exec web python manage.py migrate

# Süper kullanıcı oluştur
docker-compose exec web python manage.py createsuperuser
```

Servisler:
| Servis     | Port  |
| ---------- | ----- |
| Django     | 8000  |
| PostgreSQL | 5432  |
| Redis      | 6379  |

---

## 📡 API Endpoints

Tüm API endpoint'leri `/api/` prefix'i altındadır.

### Katalog

| Metot | Endpoint                                | Açıklama                   |
| ----- | --------------------------------------- | -------------------------- |
| GET   | `/api/catalog/categories/`              | Kategori ağacı (nested)    |
| GET   | `/api/catalog/products/`                | Ürün listesi (filtrelenebilir, aranabilir) |
| GET   | `/api/catalog/products/<slug>/`         | Ürün detayı               |
| GET   | `/api/catalog/products/<slug>/reviews/` | Ürün yorumları             |
| GET   | `/api/catalog/brands/`                  | Marka listesi              |
| GET   | `/api/catalog/brands/<slug>/`           | Marka detayı               |
| GET   | `/api/catalog/brands/<slug>/products/`  | Markaya ait ürünler        |
| GET   | `/api/catalog/reviews/featured/`        | Öne çıkan yorumlar         |

### Sepet

| Metot  | Endpoint                        | Açıklama               |
| ------ | ------------------------------- | ---------------------- |
| GET    | `/api/cart/`                    | Sepet detayı           |
| POST   | `/api/cart/add/`                | Sepete ürün ekle       |
| PATCH  | `/api/cart/items/<id>/`         | Miktar güncelle        |
| DELETE | `/api/cart/items/<id>/`         | Sepetten ürün kaldır   |

### Sipariş

| Metot | Endpoint                | Açıklama                    |
| ----- | ----------------------- | --------------------------- |
| GET   | `/api/orders/history/`  | Sipariş geçmişi (auth)     |
| POST  | `/api/orders/create/`   | Yeni sipariş oluştur (auth) |

### Kimlik Doğrulama

| Metot | Endpoint              | Açıklama          |
| ----- | --------------------- | ----------------- |
| POST  | `/api/auth/login/`    | Giriş yap         |
| POST  | `/api/auth/register/` | Kayıt ol           |
| POST  | `/api/auth/logout/`   | Çıkış yap (auth)  |
| GET   | `/api/auth/profile/`  | Profil bilgisi (auth) |

### İstek Listesi & Adresler

| Metot | Endpoint            | Açıklama                 |
| ----- | ------------------- | ------------------------ |
| GET   | `/api/wishlist/`    | İstek listesi (auth)    |
| GET   | `/api/addresses/`   | Adres listesi (auth)    |
| POST  | `/api/addresses/`   | Yeni adres ekle (auth)  |

**Filtreleme & Arama:**
- Filtreleme: `?category=<slug>`, `?brand=<slug>`, `?is_featured=true`
- Arama: `?search=<query>` (ad, açıklama, SKU, etiket)
- Sıralama: `?ordering=price`, `?ordering=-created_at`, `?ordering=rating_average`
- Sayfalama: 24 ürün/sayfa

---

## ⚙ Ortam Değişkenleri

| Değişken                 | Açıklama                          | Varsayılan          |
| ------------------------ | --------------------------------- | ------------------- |
| `DJANGO_SECRET_KEY`      | Django gizli anahtarı             | —                   |
| `DJANGO_DEBUG`           | Debug modu                        | `True`              |
| `POSTGRES_DB`            | PostgreSQL veritabanı adı         | `albaniashop`       |
| `POSTGRES_USER`          | PostgreSQL kullanıcı adı          | `albaniashop`       |
| `POSTGRES_PASSWORD`      | PostgreSQL şifresi                | —                   |
| `REDIS_URL`              | Redis bağlantı URL'si             | `redis://redis:6379`|
| `CORS_ALLOWED_ORIGINS`   | İzin verilen origin listesi       | `localhost:3000`    |

---

## 🌍 Uluslararasılaştırma

- **Varsayılan dil:** Türkçe (tr)
- **Desteklenen diller:** Türkçe, İngilizce
- **Zaman dilimi:** Europe/Istanbul
- **Para birimleri:** TRY (₺), EUR (€), USD ($)

---

## 🚢 Deployment

### Production Kontrol Listesi

1. Ortam değişkenlerini ayarla (`DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`, veritabanı bilgileri)
2. PostgreSQL ve Redis servislerini hazırla
3. Migration'ları çalıştır: `python manage.py migrate`
4. Statik dosyaları topla: `python manage.py collectstatic --noinput`
5. HTTPS ve WAF yapılandır (Cloudflare önerilen)
6. Yedekleme ve izleme sistemlerini kur

### Önerilen Altyapı

| Bileşen       | Önerilen                                        |
| ------------- | ------------------------------------------------ |
| **Compute**   | Azure Container Apps / AWS ECS Fargate / K8s     |
| **Veritabanı**| Azure Database for PostgreSQL / AWS RDS           |
| **Önbellek**  | Azure Cache for Redis / AWS ElastiCache           |
| **CDN/WAF**   | Cloudflare                                        |
| **İzleme**    | Sentry (hata), Prometheus + Grafana (metrik)      |

### Ölçekleme Yol Haritası

1. **Mevcut:** Redis önbellek ile modüler Django monolit
2. **Faz 1:** Elasticsearch ile ürün arama
3. **Faz 2:** Celery workers ile asenkron görevler (bildirim, fatura, webhook)
4. **Faz 3:** Mikro servis mimarisi (arama, ödeme, bildirim, analitik)

---

## 📄 Lisans

Bu proje özel lisans altındadır. Tüm hakları saklıdır.
