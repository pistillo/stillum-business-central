# Deployment Guide

This guide covers deploying the Stillum Business Portal to different environments.

## Table of Contents

1. Local Development
2. Docker Deployment
3. Kubernetes Deployment
4. Environment Configuration
5. Database Migration
6. Troubleshooting

## Local Development

### Prerequisites

- Java 21
- Node.js 20+
- Docker and Docker Compose
- Maven 3.9+

### Quick Start

```bash
# Clone repository
git clone https://github.com/stillum/business-portal.git
cd business-portal

# Copy environment file
cp .env.example .env

# Start infrastructure
docker-compose up -d

# Wait for services to be healthy
docker-compose ps

# Access services
# Portal UI: http://localhost:3000
# Registry API: http://localhost:8082
# Publisher: http://localhost:8083
# Runtime Gateway: http://localhost:8081
# Keycloak: http://localhost:8080
# Temporal UI: http://localhost:8088
```

### Development Services

Terminal 1: Registry API
```bash
cd registry-api
mvn clean quarkus:dev
```

Terminal 2: Publisher
```bash
cd publisher
mvn clean quarkus:dev
```

Terminal 3: Runtime Gateway
```bash
cd runtime-gateway
mvn clean quarkus:dev
```

Terminal 4: Portal UI
```bash
cd portal-ui
npm install
npm run dev
```

## Docker Deployment

### Build Images

Build all images:
```bash
make docker-build
```

Or build individual services:
```bash
docker build -t stillum/registry-api:1.0.0 ./registry-api
docker build -t stillum/publisher:1.0.0 ./publisher
docker build -t stillum/runtime-gateway:1.0.0 ./runtime-gateway
docker build -t stillum/portal-ui:1.0.0 ./portal-ui
```

### Run with Docker Compose

Start all services:
```bash
docker-compose up -d
```

View logs:
```bash
docker-compose logs -f
```

Check health:
```bash
docker-compose ps
```

Stop all services:
```bash
docker-compose down
```

Stop and remove volumes:
```bash
docker-compose down -v
```

## Kubernetes Deployment

### Prerequisites

- Kubernetes 1.24+
- Helm 3.13+
- kubectl configured
- PersistentVolumes available

### Using Helm

Install to default namespace:
```bash
helm install stillum-platform ./charts/stillum-platform
```

Or install with custom namespace and values:
```bash
helm install stillum-platform ./charts/stillum-platform \
  --namespace stillum-prod \
  --create-namespace \
  -f charts/values-prod.yaml
```

Upgrade:
```bash
helm upgrade stillum-platform ./charts/stillum-platform \
  --namespace stillum-prod \
  -f charts/values-prod.yaml \
  --wait
```

Uninstall:
```bash
helm uninstall stillum-platform --namespace stillum-prod
```

## Environment Configuration

### Development (.env)

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=stillum
DATABASE_PASSWORD=stillum123

S3_ENDPOINT=localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin

QUARKUS_LOG_LEVEL=DEBUG
NODE_ENV=development
```

### Production Values

See charts/values-prod.yaml for full production configuration.

## Database Migration

Initialize databases:
```bash
docker-compose exec postgres psql -U stillum -f /docker-entrypoint-initdb.d/init.sql
```

Or manually:
```bash
psql -h localhost -U stillum -d template1 << EOF
CREATE DATABASE stillum_registry;
CREATE DATABASE stillum_publisher;
CREATE DATABASE stillum_gateway;
GRANT ALL PRIVILEGES ON DATABASE stillum_registry TO stillum;
GRANT ALL PRIVILEGES ON DATABASE stillum_publisher TO stillum;
GRANT ALL PRIVILEGES ON DATABASE stillum_gateway TO stillum;
EOF
```

## Health Checks

Registry API:
```bash
curl http://localhost:8082/health
```

Publisher:
```bash
curl http://localhost:8083/health
```

Runtime Gateway:
```bash
curl http://localhost:8081/health
```

## Troubleshooting

### Services not starting

Check Docker logs:
```bash
docker-compose logs <service-name>
```

Check health:
```bash
docker-compose ps
```

Restart service:
```bash
docker-compose restart <service-name>
```

### Database connection issues

Test connection:
```bash
docker-compose exec postgres psql -U stillum -c "SELECT version();"
```

Check logs:
```bash
docker-compose logs postgres
```

### Memory issues

Increase Docker memory in docker-compose.yml

Check node resources:
```bash
kubectl describe node <node-name>
```

Check pod resource usage:
```bash
kubectl top pods -n stillum-prod
```

## Security Checklist

- Change default passwords
- Configure HTTPS/TLS
- Enable authentication/authorization
- Restrict network access
- Enable audit logging
- Backup sensitive data
- Regular security updates
- Monitor for vulnerabilities
