#!/usr/bin/env bash
# Ripristina Nexus da un backup (es. dopo reset DB).
# Uso: ./scripts/restore-nexus-from-backup.sh [file.tar.gz]
#      Se ometti il file, usa l'ultimo backup in backup/nexus/.

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
VOLUME_NAME="${DOCKER_NEXUS_VOLUME:-stillum-business-central_nexus-data}"
BACKUP_DIR="$PROJECT_ROOT/backup/nexus"

if [ -n "$1" ]; then
  BACKUP_FILE="$1"
  if [ ! -f "$BACKUP_FILE" ]; then
    echo "File non trovato: $BACKUP_FILE"
    exit 1
  fi
else
  LATEST=$(ls -t "$BACKUP_DIR"/nexus-data-*.tar.gz 2>/dev/null | head -1)
  if [ -z "$LATEST" ]; then
    echo "Nessun backup in $BACKUP_DIR"
    echo "Uso: $0 <backup/nexus/nexus-data-YYYYMMDD-HHMMSS.tar.gz>"
    exit 1
  fi
  BACKUP_FILE="$LATEST"
  echo "Uso ultimo backup: $BACKUP_FILE"
fi

BACKUP_FILE="$(cd "$(dirname "$BACKUP_FILE")" && pwd)/$(basename "$BACKUP_FILE")"

echo "=== Ripristino Nexus da backup ==="
echo "Backup: $BACKUP_FILE"
echo "Volume: $VOLUME_NAME"
echo ""

# Ferma Nexus
if docker ps -q -f name=stillum-nexus | grep -q .; then
  echo "Fermo stillum-nexus..."
  docker stop stillum-nexus
fi

# Svuota il volume e ripristina dal backup
echo "Ripristino dati nel volume..."
docker run --rm \
  -v "$VOLUME_NAME:/data" \
  -v "$(dirname "$BACKUP_FILE"):/backup:ro" \
  alpine \
  sh -c "rm -rf /data/* /data/..?* /data/.[!.]* 2>/dev/null; tar xzf \"/backup/$(basename "$BACKUP_FILE")\" -C /data"

echo "Ripristino completato. Avvio Nexus con docker compose..."
cd "$PROJECT_ROOT"
docker compose up -d nexus

echo ""
echo "Fatto. Nexus è in esecuzione con i dati del backup."
echo "URL: http://localhost:8070"
