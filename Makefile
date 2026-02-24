.PHONY: infra dev-registry dev-publisher dev-gateway dev-ui full-stack down logs help

## ─── Infrastruttura ────────────────────────────────────────────────────────

infra:  ## Avvia i servizi infrastrutturali (PostgreSQL, MinIO, Temporal, Keycloak)
	docker compose up -d

infra-down:  ## Ferma e rimuove i container infrastrutturali
	docker compose down

## ─── Dev mode (hot-reload per ogni servizio) ───────────────────────────────

dev-registry:  ## Avvia registry-api in Quarkus dev mode (porta 8081)
	cd registry-api && mvn quarkus:dev

dev-publisher:  ## Avvia publisher in Quarkus dev mode (porta 8082)
	cd publisher && mvn quarkus:dev

dev-gateway:  ## Avvia runtime-gateway in Quarkus dev mode (porta 8080)
	cd runtime-gateway && mvn quarkus:dev

dev-ui:  ## Avvia portal-ui in modalità sviluppo Vite (porta 5173)
	cd portal-ui && npm run dev

## ─── Full-stack (tutti i container) ────────────────────────────────────────

full-stack:  ## Costruisce e avvia l'intero stack (infra + app services)
	docker compose -f docker-compose.yml -f docker-compose.full.yml up --build

full-stack-d:  ## Full-stack in background (detached)
	docker compose -f docker-compose.yml -f docker-compose.full.yml up --build -d

down:  ## Ferma e rimuove tutti i container (infra + app services)
	docker compose -f docker-compose.yml -f docker-compose.full.yml down

logs:  ## Segue i log di tutti i container
	docker compose -f docker-compose.yml -f docker-compose.full.yml logs -f

## ─── Utility ────────────────────────────────────────────────────────────────

test-registry:  ## Esegue i test del registry-api
	cd registry-api && mvn test

test-publisher:  ## Esegue i test del publisher
	cd publisher && mvn test

test-ui:  ## Esegue i test del portal-ui
	cd portal-ui && npm test

help:  ## Mostra questo messaggio di aiuto
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	  awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
