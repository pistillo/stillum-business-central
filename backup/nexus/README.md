# Backup Nexus

Cartella locale montata in Docker Compose come volume (`./backup/nexus` → `/nexus-backup` nel container Nexus).

I file `nexus-data-*.tar.gz` creati da `./scripts/backup-nexus.sh` possono essere committati o tenuti solo in locale (i `.tar.gz` sono in `.gitignore` se non vuoi versionarli).

- **Backup:** `./scripts/backup-nexus.sh`
- **Restore:** `./scripts/restore-nexus-from-backup.sh`
