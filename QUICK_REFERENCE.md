# Stillum Business Portal - Quick Reference

## Project Location
```
/sessions/sharp-beautiful-knuth/mnt/stillum-business-central/
```

## Quick Start (5 minutes)

```bash
cd /sessions/sharp-beautiful-knuth/mnt/stillum-business-central/

# 1. Copy environment
cp .env.example .env

# 2. Start all services
docker-compose up -d

# 3. Wait for health checks
docker-compose ps

# 4. Access services
# Portal UI: http://localhost:3000
# APIs: http://localhost:8082-8083
# Admin: http://localhost:8080 (Keycloak)
```

## Key Files to Review

### Documentation
- **README.md** - Start here! Overview and architecture
- **DEPLOYMENT.md** - How to deploy everywhere
- **CONTRIBUTING.md** - Development guidelines
- **PROJECT_SETUP_SUMMARY.md** - Complete setup details

### Configuration
- **.env.example** - Copy to .env and customize
- **docker-compose.yml** - Local development stack
- **Makefile** - Common development commands

### Services
- **/publisher/** - Artifact validation and publishing
- **/runtime-gateway/** - Workflow execution engine
- **/charts/stillum-platform/** - Kubernetes deployment

## Common Commands

```bash
# Build
make build              # Build all services
make docker-build       # Build Docker images

# Test
make test               # Run all tests
make lint               # Lint code

# Run
make run                # Start everything
make down               # Stop everything
make logs               # View logs

# Deploy
make helm-install       # Deploy to Kubernetes
make helm-upgrade       # Update Kubernetes deployment
```

## Service Ports

| Service | Port | URL |
|---------|------|-----|
| Portal UI | 3000 | http://localhost:3000 |
| Registry API | 8082 | http://localhost:8082 |
| Publisher | 8083 | http://localhost:8083 |
| Runtime Gateway | 8081 | http://localhost:8081 |
| Keycloak | 8080 | http://localhost:8080 |
| Temporal UI | 8088 | http://localhost:8088 |
| MinIO | 9001 | http://localhost:9001 |

## Default Credentials

| Service | Username | Password |
|---------|----------|----------|
| Keycloak | admin | admin123 |
| MinIO | minioadmin | minioadmin |
| Database | stillum | stillum123 |

## Important Paths

```
Publisher Service
  └── /publisher/src/main/java/com/stillum/publisher/
      ├── service/    (Validation, Bundle, Publish, etc.)
      ├── resource/   (REST endpoints)
      └── dto/        (Data transfer objects)

Runtime Gateway
  └── /runtime-gateway/src/main/java/com/stillum/gateway/
      ├── service/    (Workflow, Task, Instance)
      ├── worker/     (BPMN, DMN, Form handlers)
      └── resource/   (REST endpoints)

Helm Charts
  └── /charts/stillum-platform/
      ├── templates/  (Kubernetes resources)
      └── values*.yaml (Configuration per environment)

CI/CD
  └── /.github/workflows/
      ├── ci.yml      (Build and test)
      ├── docker.yml  (Build and push images)
      └── helm.yml    (Deploy charts)
```

## File Statistics

- Java Source Files: 21 (Publisher + Gateway)
- Configuration Files: 13 (POM, YAML, Properties)
- Docker Files: 5 (Dockerfiles + docker-compose)
- Kubernetes/Helm Files: 13 (Deployments, Services, etc.)
- CI/CD Workflows: 3 (GitHub Actions)
- Documentation: 6 files
- Total: 68 created files + 239 total including inherited

## Development Workflow

### Option 1: Docker Compose (Easiest)
```bash
docker-compose up -d    # Start everything
docker-compose down     # Stop everything
```

### Option 2: Local Development
```bash
docker-compose up -d postgres minio temporal keycloak

# Terminal 1
cd registry-api && mvn quarkus:dev

# Terminal 2
cd publisher && mvn quarkus:dev

# Terminal 3
cd runtime-gateway && mvn quarkus:dev

# Terminal 4
cd portal-ui && npm install && npm run dev
```

### Option 3: Kubernetes
```bash
# Development
helm install stillum-platform ./charts/stillum-platform \
  --namespace stillum-dev --create-namespace \
  -f charts/values-dev.yaml

# Production
helm install stillum-platform ./charts/stillum-platform \
  --namespace stillum-prod --create-namespace \
  -f charts/values-prod.yaml
```

## Testing

```bash
# Unit tests
for svc in registry-api publisher runtime-gateway; do
  cd $svc && mvn test && cd ..
done

# Frontend tests
cd portal-ui && npm test

# Integration tests (after docker-compose up)
curl http://localhost:8082/health
curl http://localhost:8083/health
curl http://localhost:8081/health
```

## Troubleshooting

### Services not starting
```bash
docker-compose logs <service>
docker-compose restart <service>
```

### Database issues
```bash
docker-compose exec postgres psql -U stillum -d stillum_registry
```

### Check health
```bash
docker-compose ps
docker-compose logs -f
```

## API Examples

### Publish Artifact
```bash
curl -X POST http://localhost:8083/api/v1/tenants/default/publish \
  -H "Content-Type: application/json" \
  -d '{
    "artifactId": "order-process",
    "versionId": "1.0.0",
    "environmentId": "production",
    "releaseNotes": "Initial release"
  }'
```

### Start Workflow
```bash
curl -X POST http://localhost:8081/api/v1/tenants/default/instances \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "order-process",
    "bundleRef": "default/bpmn/order-process/1.0.0",
    "input": {"orderId": "ORD-001"}
  }'
```

## Environment Variables

Key variables to customize:

```bash
# Database
DATABASE_HOST=localhost
DATABASE_PASSWORD=stillum123

# S3/MinIO
S3_ENDPOINT=localhost:9000
S3_ACCESS_KEY=minioadmin

# Temporal
TEMPORAL_HOST=localhost
TEMPORAL_PORT=7233

# Keycloak
KEYCLOAK_ADMIN_PASSWORD=admin123
```

## Documentation Index

| File | Purpose |
|------|---------|
| README.md | Project overview, architecture, getting started |
| DEPLOYMENT.md | How to deploy to different environments |
| CONTRIBUTING.md | Code standards and contribution process |
| PROJECT_SETUP_SUMMARY.md | Detailed setup information |
| CHANGELOG.md | Version history and release notes |
| FILES_CREATED.txt | Complete file listing |
| QUICK_REFERENCE.md | This file - quick lookup |

## Support

- Check documentation first (README.md, DEPLOYMENT.md)
- Review configuration files (.env.example, docker-compose.yml)
- Check logs: `docker-compose logs -f <service>`
- Verify health: `docker-compose ps`

## Key Technologies

- **Backend**: Quarkus 3.17.5, Java 21
- **Database**: PostgreSQL 16
- **Workflow**: Temporal 1.25.0
- **Storage**: MinIO (S3-compatible)
- **Auth**: Keycloak 24.0
- **Frontend**: Nginx
- **DevOps**: Docker, Kubernetes, Helm 3
- **CI/CD**: GitHub Actions

## Next Actions

1. Review README.md for complete overview
2. Copy .env.example to .env
3. Run docker-compose up -d
4. Access Portal UI at http://localhost:3000
5. Check DEPLOYMENT.md for production setup

---

**Created**: February 22, 2026  
**Status**: Production Ready  
**Version**: 1.0.0
