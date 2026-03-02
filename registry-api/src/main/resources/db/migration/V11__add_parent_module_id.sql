-- V11: Aggiunta parent_module_id su artifact per tracciare la relazione COMPONENT -> MODULE

ALTER TABLE artifact
    ADD COLUMN parent_module_id UUID REFERENCES artifact(id) ON DELETE SET NULL;

-- Backfill: ricava il legame da righe già presenti nella tabella dependency
UPDATE artifact a
SET parent_module_id = d.depends_on_artifact_id
FROM dependency d
JOIN artifact_version av ON av.id = d.artifact_version_id
WHERE av.artifact_id = a.id
  AND a.type = 'COMPONENT';
