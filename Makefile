.PHONY: help setup build test run down clean docker-build docker-push helm-lint helm-install helm-uninstall

DOCKER_REGISTRY ?= ghcr.io
DOCKER_REPO ?= stillum
IMAGE_TAG ?= latest
HELM_RELEASE ?= stillum-platform
HELM_NAMESPACE ?= default
HELM_VALUES ?= charts/values.yaml

help:
	@echo "Stillum Business Portal - Development Commands"
	@echo ""
	@echo "Local Development:"
	@echo "  make setup              - Setup development environment"
	@echo "  make build              - Build all services"
	@echo "  make test               - Run all tests"
	@echo "  make run                - Start all services"
	@echo "  make down               - Stop all services"
	@echo "  make logs               - View service logs"
	@echo "  make clean              - Clean build artifacts"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build       - Build Docker images"
	@echo "  make docker-push        - Push Docker images to registry"
	@echo ""
	@echo "Kubernetes/Helm:"
	@echo "  make helm-lint          - Lint Helm charts"
	@echo "  make helm-install       - Install Helm chart"
	@echo "  make helm-upgrade       - Upgrade Helm release"
	@echo "  make helm-uninstall     - Uninstall Helm release"
	@echo ""
	@echo "Utilities:"
	@echo "  make format             - Format code"
	@echo "  make lint               - Lint code"
	@echo "  make db-init            - Initialize databases"
	@echo "  make db-migrate         - Run database migrations"

setup:
	@echo "Setting up development environment..."
	cp -n .env.example .env || true
	docker-compose up -d postgres minio temporal keycloak
	@echo "Waiting for services to be ready..."
	sleep 10
	@echo "Development environment ready!"

build:
	@echo "Building all services..."
	cd registry-api && mvn clean package -DskipTests && cd ..
	cd publisher && mvn clean package -DskipTests && cd ..
	cd runtime-gateway && mvn clean package -DskipTests && cd ..
	cd portal-ui && npm install && npm run build && cd ..

test:
	@echo "Running tests..."
	cd registry-api && mvn test && cd ..
	cd publisher && mvn test && cd ..
	cd runtime-gateway && mvn test && cd ..
	cd portal-ui && npm test && cd ..

run:
	@echo "Starting all services..."
	docker-compose up -d
	@echo "Services started!"
	@echo "Registry API: http://localhost:8082"
	@echo "Publisher: http://localhost:8083"
	@echo "Runtime Gateway: http://localhost:8081"
	@echo "Portal UI: http://localhost:3000"
	@echo "Keycloak: http://localhost:8080"
	@echo "Temporal UI: http://localhost:8088"

down:
	@echo "Stopping all services..."
	docker-compose down

logs:
	docker-compose logs -f

clean:
	@echo "Cleaning build artifacts..."
	cd registry-api && mvn clean && cd ..
	cd publisher && mvn clean && cd ..
	cd runtime-gateway && mvn clean && cd ..
	cd portal-ui && rm -rf node_modules dist && cd ..
	docker-compose down -v

docker-build:
	@echo "Building Docker images..."
	docker build -t $(DOCKER_REGISTRY)/$(DOCKER_REPO)/registry-api:$(IMAGE_TAG) ./registry-api
	docker build -t $(DOCKER_REGISTRY)/$(DOCKER_REPO)/publisher:$(IMAGE_TAG) ./publisher
	docker build -t $(DOCKER_REGISTRY)/$(DOCKER_REPO)/runtime-gateway:$(IMAGE_TAG) ./runtime-gateway
	docker build -t $(DOCKER_REGISTRY)/$(DOCKER_REPO)/portal-ui:$(IMAGE_TAG) ./portal-ui

docker-push: docker-build
	@echo "Pushing Docker images..."
	docker push $(DOCKER_REGISTRY)/$(DOCKER_REPO)/registry-api:$(IMAGE_TAG)
	docker push $(DOCKER_REGISTRY)/$(DOCKER_REPO)/publisher:$(IMAGE_TAG)
	docker push $(DOCKER_REGISTRY)/$(DOCKER_REPO)/runtime-gateway:$(IMAGE_TAG)
	docker push $(DOCKER_REGISTRY)/$(DOCKER_REPO)/portal-ui:$(IMAGE_TAG)

helm-lint:
	@echo "Linting Helm chart..."
	helm lint charts/stillum-platform
	helm lint charts/stillum-platform --strict

helm-install:
	@echo "Installing Helm chart..."
	helm install $(HELM_RELEASE) charts/stillum-platform \
		-n $(HELM_NAMESPACE) \
		--create-namespace \
		-f $(HELM_VALUES)

helm-upgrade:
	@echo "Upgrading Helm release..."
	helm upgrade $(HELM_RELEASE) charts/stillum-platform \
		-n $(HELM_NAMESPACE) \
		-f $(HELM_VALUES)

helm-uninstall:
	@echo "Uninstalling Helm release..."
	helm uninstall $(HELM_RELEASE) -n $(HELM_NAMESPACE)

format:
	@echo "Formatting code..."
	cd portal-ui && npm run format && cd ..

lint:
	@echo "Linting code..."
	cd registry-api && mvn checkstyle:check && cd ..
	cd publisher && mvn checkstyle:check && cd ..
	cd runtime-gateway && mvn checkstyle:check && cd ..
	cd portal-ui && npm run lint && cd ..

db-init:
	@echo "Initializing databases..."
	docker-compose exec postgres psql -U stillum -f /docker-entrypoint-initdb.d/init.sql

db-migrate:
	@echo "Running database migrations..."
	cd registry-api && mvn flyway:migrate && cd ..
	cd publisher && mvn flyway:migrate && cd ..
	cd runtime-gateway && mvn flyway:migrate && cd ..

.DEFAULT_GOAL := help
