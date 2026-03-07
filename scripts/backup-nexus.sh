#!/usr/bin/env bash
# Backup del volume Nexus nella cartella locale backup/nexus/ (montata come volume in docker-compose).
# Crea backup/nexus/nexus-data-YYYYMMDD-HHMMSS.tar.gz (cartella committabile).
# Per ripristino: ./scripts/restore-nexus-from-backup.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
VOLUME_NAME="${DOCKER_NEXUS_VOLUME:-stillum-business-central_nexus-data}"
# Stessa cartella montata in docker-compose come ./backup/nexus → /nexus-backup
BACKUP_DIR="$PROJECT_ROOT/backup/nexus"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/nexus-data-$TIMESTAMP.tar.gz"

echo "=== Backup Nexus ==="
echo "Volume dati: $VOLUME_NAME"
echo "Destinazione (cartella locale committabile): $BACKUP_DIR"
echo "File: nexus-data-$TIMESTAMP.tar.gz"
echo ""

mkdir -p "$BACKUP_DIR"

# Ferma Nexus per backup consistente
if docker ps -q -f name=stillum-nexus | grep -q .; then
  echo "Fermo stillum-nexus..."
  docker stop stillum-nexus
  STOPPED=1
else
  STOPPED=0
fi

echo "Creazione archivio in $BACKUP_DIR ..."
docker run --rm \
  -v "$VOLUME_NAME:/data:ro" \
  -v "$BACKUP_DIR:/backup" \
  alpine \
  tar czf "/backup/nexus-data-$TIMESTAMP.tar.gz" -C /data .

echo "Backup creato: $BACKUP_FILE"

if [ "$STOPPED" -eq 1 ]; then
  echo "Riavvio stillum-nexus..."
  cd "$PROJECT_ROOT"
  docker compose up -d nexus
fi

echo ""
echo "Fatto. Per ripristinare: ./scripts/restore-nexus-from-backup.sh $BACKUP_FILE"
