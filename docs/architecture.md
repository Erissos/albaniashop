# Albaniashop Enterprise Architecture

## Platform shape
- Django monolith organized as bounded apps: accounts, catalog, cart, orders, promotions, notifications, api, pages, core.
- Frontend rendering uses Jinja2 templates for customer-facing routes, while Django templates remain available for admin and legacy forms.
- Service modules isolate catalog search, cart mutation, homepage merchandising and checkout orchestration.
- REST API exposes catalog and order-history resources and is ready to be extended with JWT and GraphQL gateway layers.

## Domain capabilities
- Catalog supports nested categories, product variants, attribute values, featured merchandising, SEO metadata, stock safety thresholds, inventory movement logs and moderated reviews.
- Accounts support address book, privacy preferences, anonymous packaging defaults, marketing consent and currency/language preferences.
- Orders support subtotal, tax, shipping, discount and payment status breakdowns, invoice numbers, address snapshots and event timelines.
- Promotions support coupon validation, redemption tracking and discount policies.
- Notifications support reusable templates and delivery logs across email, SMS and push channels.

## Scalability strategy
- Cache product listing and navigation fragments with Redis.
- Move search to Elasticsearch or OpenSearch behind a dedicated search adapter when catalog size outgrows relational filtering.
- Split asynchronous concerns into workers: notification dispatch, invoice generation, payment webhooks, search indexing and reporting ETL.
- Keep the current modular monolith until team size and deployment cadence justify service extraction.
- Extract first candidates as microservices: search, payments, notifications, analytics.

## Security baseline
- Secure cookies, HSTS, clickjacking protection, MIME sniffing protection and CSRF enforcement are enabled by settings.
- Session-backed storefront is available today; DRF layer is ready for JWT extension for mobile and partner clients.
- Stock-safe checkout writes run inside a transaction and create explicit order events and inventory movements.
- Privacy-sensitive UX patterns are supported through discreet packaging markers and private account defaults.

## Recommended next infrastructure steps
- Put Cloudflare or Fastly in front of the app for CDN, WAF and image caching.
- Run PostgreSQL managed service with read replicas once reporting and catalog browse traffic grows.
- Add Celery or Dramatiq with Redis for background jobs.
- Add OpenTelemetry tracing, Sentry error capture and Prometheus metrics.
- Introduce PSP adapters for Stripe, Adyen or local providers behind a payment service interface.
