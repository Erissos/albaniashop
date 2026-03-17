# Deployment Strategy

## Runtime topology
- Web tier: Django + Gunicorn containers behind Nginx or cloud load balancer.
- Data tier: PostgreSQL primary, optional read replicas, Redis cache/session store.
- Assets: object storage for media, CDN for static and transformed media delivery.
- Background jobs: separate worker deployment for notifications, indexing, payments and analytics.

## Production checklist
1. Set environment variables from .env.example in a managed secret store.
2. Provision PostgreSQL, Redis and object storage.
3. Run `python manage.py migrate` during release.
4. Run `python manage.py collectstatic --noinput` during image build or release task.
5. Front the application with HTTPS-only ingress and a WAF.
6. Enable backups, point-in-time recovery and uptime checks.

## CI/CD flow
1. GitHub Actions installs dependencies and runs Django quality gates.
2. Build Docker image and publish to registry on main branch or release tags.
3. Deploy image to staging automatically and production via approval gate.
4. Run smoke checks against catalog, cart and checkout endpoints after deployment.

## Cloud recommendation
- Compute: Azure Container Apps, AWS ECS Fargate or Kubernetes depending on operational maturity.
- Database: Azure Database for PostgreSQL Flexible Server or Amazon RDS PostgreSQL.
- Cache: Azure Cache for Redis or Amazon ElastiCache.
- CDN/WAF: Cloudflare preferred for edge caching and bot protection.
- Monitoring: Sentry + Prometheus/Grafana + managed logs.
