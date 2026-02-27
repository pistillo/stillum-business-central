-- V9: Dati di seed per Module e Component

-- Modulo demo (UI Module)
INSERT INTO artifact (id, tenant_id, type, title, description, owner_id, status, area, tags)
VALUES (
    '00000000-0000-0000-0000-000000000210',
    '00000000-0000-0000-0000-000000000001',
    'MODULE',
    'Modulo Gestione Ordini',
    'Modulo UI per la gestione completa degli ordini',
    '00000000-0000-0000-0000-000000000100',
    'DRAFT',
    'Sales',
    ARRAY['module', 'orders', 'ui']
)
ON CONFLICT DO NOTHING;

-- Versione del modulo
INSERT INTO artifact_version (id, artifact_id, version, state, created_by)
VALUES (
    '00000000-0000-0000-0000-000000000310',
    '00000000-0000-0000-0000-000000000210',
    '1.0.0',
    'DRAFT',
    '00000000-0000-0000-0000-000000000100'
)
ON CONFLICT DO NOTHING;

-- Componente demo (UI Component collegato al modulo)
INSERT INTO artifact (id, tenant_id, type, title, description, owner_id, status, area, tags)
VALUES (
    '00000000-0000-0000-0000-000000000211',
    '00000000-0000-0000-0000-000000000001',
    'COMPONENT',
    'Tabella Lista Ordini',
    'Componente tabella per la visualizzazione degli ordini',
    '00000000-0000-0000-0000-000000000100',
    'DRAFT',
    'Sales',
    ARRAY['component', 'orders', 'table']
)
ON CONFLICT DO NOTHING;

-- Versione del componente
INSERT INTO artifact_version (id, artifact_id, version, state, created_by)
VALUES (
    '00000000-0000-0000-0000-000000000311',
    '00000000-0000-0000-0000-000000000211',
    '1.0.0',
    'DRAFT',
    '00000000-0000-0000-0000-000000000100'
)
ON CONFLICT DO NOTHING;

-- Dipendenza: Component -> Module
INSERT INTO dependency (id, artifact_version_id, depends_on_artifact_id, depends_on_version_id)
VALUES (
    '00000000-0000-0000-0000-000000000400',
    '00000000-0000-0000-0000-000000000311',
    '00000000-0000-0000-0000-000000000210',
    '00000000-0000-0000-0000-000000000310'
)
ON CONFLICT DO NOTHING;
