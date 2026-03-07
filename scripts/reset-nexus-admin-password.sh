#!/usr/bin/env bash
# Reset password admin Nexus a "admin123" agendo sul DB H2 (Nexus 3.38+).
# Richiede: Docker, volume nexus-data esistente.

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
VOLUME_NAME="${DOCKER_NEXUS_VOLUME:-stillum-business-central_nexus-data}"
H2_VERSION="2.2.224"
H2_JAR="h2-${H2_VERSION}.jar"
H2_URL="https://repo1.maven.org/maven2/com/h2database/h2/${H2_VERSION}/${H2_JAR}"
DB_PATH="/nexus-data/db/nexus"

echo "=== Reset password admin Nexus (→ admin123) ==="
echo "Volume: $VOLUME_NAME"
echo ""

# 1. Ferma il container Nexus
if docker ps -q -f name=stillum-nexus | grep -q .; then
  echo "Fermo il container stillum-nexus..."
  docker stop stillum-nexus
  echo "Fermo."
else
  echo "Container stillum-nexus non in esecuzione."
fi

# 2. Esegui UPDATE sul DB H2 con un container temporaneo
echo "Eseguo UPDATE sul database H2..."
docker run --rm \
  -v "$VOLUME_NAME:/nexus-data" \
  -v "$SCRIPT_DIR/nexus-reset-admin-password.sql:/reset.sql:ro" \
  -e H2_URL="$H2_URL" \
  -e H2_JAR="$H2_JAR" \
  eclipse-temurin:21-jre-alpine \
  sh -c '
    apk add --no-cache curl
    cd /tmp
    curl -sLO "$H2_URL"
    java -cp "$H2_JAR" org.h2.tools.RunScript \
      -url "jdbc:h2:file:/nexus-data/db/nexus" \
      -user "" \
      -password "" \
      -script /reset.sql
  '

echo "Password aggiornata."

# 3. Riavvia Nexus
echo "Riavvio stillum-nexus..."
cd "$PROJECT_ROOT"
docker compose up -d nexus

echo ""
echo "Fatto. Accedi a Nexus con:"
echo "  Utente: admin"
echo "  Password: admin123"
echo "  URL: http://localhost:8070"
echo ""
echo "Cambia la password dopo il primo accesso."
