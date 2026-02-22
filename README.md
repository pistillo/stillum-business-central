# Stillum Business Portal

A comprehensive enterprise BPMN/DMN workflow execution platform with artifact management, built on modern cloud-native technologies.

## Overview

Stillum Business Portal provides a complete solution for business process management, including:

- **Artifact Registry**: Version control and lifecycle management for BPMN, DMN, and Form definitions
- **Publisher Service**: Validation, bundling, and publication of artifacts to production environments
- **Runtime Gateway**: Execution engine for BPMN workflows and DMN decision tables
- **Portal UI**: Interactive web interface for workflow management and monitoring
- **Keycloak Integration**: Enterprise authentication and authorization
- **Temporal Workflow Engine**: Durable, scalable workflow execution

## Architecture

```
┌─────────────────────────────────────────────────┐
│          Portal UI (React/Vue)                  │
└────────────┬────────────────────────────────────┘
             │
┌────────────┴─────────────────────────────────────┐
│           API Gateway / Load Balancer             │
└────────────┬─────────────────────────────────────┘
             │
    ┌────────┼────────┬──────────┐
    │        │        │          │
┌───v──┐ ┌──v───┐ ┌──v────┐ ┌──v────┐
│Reg.  │ │Pub.  │ │Runtime│ │Keyc.  │
│API   │ │Srv.  │ │GW     │ │loak   │
└───┬──┘ └──┬───┘ └──┬────┘ └──┬────┘
    │       │       │         │
┌───┴───────┴───────┴─────────┴────┐
│      PostgreSQL Database           │
└────────────────────────────────────┘

    ┌──────────────┐
    │   Temporal   │
    │   Engine     │
    └──┬───────────┘
       │
    ┌──v──────────┐
    │   MinIO     │
    │   (S3)      │
    └─────────────┘
```

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Java 21
- Node.js 20
- Maven 3.9+
- npm or yarn

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/stillum/business-portal.git
cd business-portal
```

2. Start infrastructure:
```bash
docker-compose up -d
```

Wait for all services to be healthy (check with `docker-compose ps`)

3. Build and run backend services:
```bash
# Registry API
cd registry-api && mvn clean quarkus:dev

# In another terminal - Publisher
cd publisher && mvn clean quarkus:dev

# In another terminal - Runtime Gateway
cd runtime-gateway && mvn clean quarkus:dev
```

4. Build and run frontend:
```bash
cd portal-ui
npm install
npm run dev
```

5. Access the services:
- Portal UI: http://localhost:3000
- Registry API: http://localhost:8082
- Publisher: http://localhost:8083
- Runtime Gateway: http://localhost:8081
- Keycloak Admin: http://localhost:8080 (admin/admin123)
- Temporal UI: http://localhost:8088
- MinIO: http://localhost:9001 (minioadmin/minioadmin)

### Testing

```bash
# Test all backend services
for service in registry-api publisher runtime-gateway; do
  cd $service
  mvn test
  cd ..
done

# Test frontend
cd portal-ui
npm test
```

### Build Docker Images

```bash
docker-compose build

# Or build individual services
docker build -t stillum/registry-api ./registry-api
docker build -t stillum/publisher ./publisher
docker build -t stillum/runtime-gateway ./runtime-gateway
docker build -t stillum/portal-ui ./portal-ui
```

## Kubernetes Deployment

### Using Helm

```bash
# Install
helm install stillum-platform ./charts/stillum-platform \
  -n stillum-prod \
  --create-namespace \
  -f charts/values-prod.yaml

# Upgrade
helm upgrade stillum-platform ./charts/stillum-platform \
  -n stillum-prod \
  -f charts/values-prod.yaml

# Uninstall
helm uninstall stillum-platform -n stillum-prod
```

### Manual Deployment

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres-statefulset.yaml
kubectl apply -f k8s/postgres-service.yaml
kubectl apply -f k8s/registry-api-deployment.yaml
kubectl apply -f k8s/publisher-deployment.yaml
kubectl apply -f k8s/runtime-gateway-deployment.yaml
kubectl apply -f k8s/portal-ui-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

## API Documentation

### Registry API

- **Base URL**: `http://localhost:8082/api/v1`

Create artifact:
```bash
curl -X POST http://localhost:8082/api/v1/artifacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "process-order",
    "type": "bpmn",
    "description": "Order processing workflow"
  }'
```

### Publisher Service

- **Base URL**: `http://localhost:8083/api/v1`

Publish artifact:
```bash
curl -X POST http://localhost:8083/api/v1/tenants/{tenantId}/publish \
  -H "Content-Type: application/json" \
  -d '{
    "artifactId": "process-order",
    "versionId": "1.0.0",
    "environmentId": "production",
    "releaseNotes": "Initial release"
  }'
```

### Runtime Gateway

- **Base URL**: `http://localhost:8081/api/v1`

Start workflow instance:
```bash
curl -X POST http://localhost:8081/api/v1/tenants/{tenantId}/instances \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "order-process",
    "bundleRef": "tenant/bpmn/process-order/1.0.0",
    "input": {
      "orderId": "ORD-12345",
      "amount": 99.99
    }
  }'
```

## Configuration

### Environment Variables

```bash
# Database
QUARKUS_DATASOURCE_JDBC_URL=jdbc:postgresql://localhost:5432/stillum_registry
QUARKUS_DATASOURCE_USERNAME=stillum
QUARKUS_DATASOURCE_PASSWORD=stillum123

# S3/MinIO
QUARKUS_S3_ENDPOINT_OVERRIDE=http://localhost:9000
QUARKUS_S3_AWS_CREDENTIALS_STATIC_PROVIDER_ACCESS_KEY_ID=minioadmin
QUARKUS_S3_AWS_CREDENTIALS_STATIC_PROVIDER_SECRET_ACCESS_KEY=minioadmin

# Temporal
STILLUM_TEMPORAL_SERVER_HOST=localhost
STILLUM_TEMPORAL_SERVER_PORT=7233

# Logging
QUARKUS_LOG_LEVEL=INFO
```

## Project Structure

```
stillum-business-portal/
├── registry-api/              # Artifact registry microservice
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── publisher/                 # Publisher microservice
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── runtime-gateway/           # Runtime execution gateway
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── portal-ui/                 # Web UI
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── charts/                    # Helm charts
│   └── stillum-platform/
├── scripts/                   # Utility scripts
│   ├── init-db.sql
│   └── keycloak-realm.json
├── docker-compose.yml         # Local development stack
├── .github/workflows/         # CI/CD
├── .editorconfig
├── .gitignore
└── README.md
```

## Technology Stack

### Backend
- **Framework**: Quarkus 3.17.5
- **Language**: Java 21
- **Database**: PostgreSQL 16
- **Workflow Engine**: Temporal 1.25.0
- **Object Storage**: MinIO (S3-compatible)
- **Authentication**: Keycloak 24.0
- **Build Tool**: Maven 3.9

### Frontend
- **Framework**: React/Vue.js
- **Node.js**: 20.x
- **Package Manager**: npm
- **Build Tool**: Vite/Webpack

### DevOps
- **Container**: Docker
- **Orchestration**: Kubernetes
- **Package Manager**: Helm 3
- **CI/CD**: GitHub Actions

## Development

### Code Style

- Java: Follow Google Java Style Guide (configured in .editorconfig)
- JavaScript/TypeScript: Prettier + ESLint
- YAML: 2-space indentation

### Commit Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: feat, fix, docs, style, refactor, perf, test, chore

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches
- `hotfix/*`: Hotfix branches

## Deployment

### Development
```bash
docker-compose up
```

### Staging
```bash
helm upgrade --install stillum-platform ./charts/stillum-platform \
  -f charts/values-staging.yaml -n stillum-staging
```

### Production
```bash
helm upgrade --install stillum-platform ./charts/stillum-platform \
  -f charts/values-production.yaml -n stillum-prod
```

## Monitoring & Logging

### Prometheus
Configure in `monitoring/prometheus.yml`

### Jaeger Tracing
Endpoint: http://localhost:16686

### ELK Stack
Elasticsearch: http://localhost:9200
Kibana: http://localhost:5601

## Troubleshooting

### Services not starting
```bash
# Check Docker Compose logs
docker-compose logs -f

# Check service health
docker-compose ps
```

### Database connection issues
```bash
# Connect to PostgreSQL
psql -h localhost -U stillum -d stillum_registry

# Check tables
\dt
```

### Temporal issues
```bash
# Check Temporal UI
curl http://localhost:8088/api/namespaces

# Check logs
docker-compose logs temporal
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

Copyright (c) 2024 Stillum. All rights reserved.

## Support

- Documentation: https://docs.stillum.com
- Issues: https://github.com/stillum/business-portal/issues
- Email: support@stillum.com

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.
