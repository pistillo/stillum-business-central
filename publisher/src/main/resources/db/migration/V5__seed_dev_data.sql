-- V5: Dati di seed per ambiente di sviluppo

-- Tenant demo
INSERT INTO tenant (id, name, domain)
VALUES ('00000000-0000-0000-0000-000000000001', 'Demo Tenant', 'demo')
ON CONFLICT (domain) DO NOTHING;

-- Ruoli standard per il tenant demo
INSERT INTO role (id, tenant_id, name, description)
VALUES
    ('00000000-0000-0000-0000-000000000010',
     '00000000-0000-0000-0000-000000000001', 'Admin',
     'Amministratore del tenant'),
    ('00000000-0000-0000-0000-000000000011',
     '00000000-0000-0000-0000-000000000001', 'Analyst',
     'Crea e modifica bozze di artefatti'),
    ('00000000-0000-0000-0000-000000000012',
     '00000000-0000-0000-0000-000000000001', 'ProcessOwner',
     'Approva e pubblica artefatti'),
    ('00000000-0000-0000-0000-000000000013',
     '00000000-0000-0000-0000-000000000001', 'Viewer',
     'Accesso in sola lettura')
ON CONFLICT DO NOTHING;

-- Utente admin demo
INSERT INTO app_user (id, tenant_id, role_id, name, email)
VALUES (
    '00000000-0000-0000-0000-000000000100',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000010',
    'Admin Demo',
    'admin@demo.stillum'
)
ON CONFLICT DO NOTHING;

-- Ambienti standard per il tenant demo
INSERT INTO environment (id, tenant_id, name, description)
VALUES
    ('00000000-0000-0000-0000-000000000020',
     '00000000-0000-0000-0000-000000000001', 'DEV', 'Sviluppo'),
    ('00000000-0000-0000-0000-000000000021',
     '00000000-0000-0000-0000-000000000001', 'QA', 'Quality Assurance'),
    ('00000000-0000-0000-0000-000000000022',
     '00000000-0000-0000-0000-000000000001', 'PROD', 'Produzione')
ON CONFLICT DO NOTHING;

-- Artefatto demo (processo BPMN)
INSERT INTO artifact (id, tenant_id, type, title, description, owner_id, status, area, tags)
VALUES (
    '00000000-0000-0000-0000-000000000200',
    '00000000-0000-0000-0000-000000000001',
    'PROCESS',
    'Processo di Onboarding Dipendente',
    'Processo BPMN per la gestione dell''onboarding di nuovi dipendenti',
    '00000000-0000-0000-0000-000000000100',
    'DRAFT',
    'HR',
    ARRAY['bpmn', 'hr', 'onboarding']
)
ON CONFLICT DO NOTHING;

-- Prima versione bozza dell'artefatto demo
INSERT INTO artifact_version (id, artifact_id, version, state, created_by)
VALUES (
    '00000000-0000-0000-0000-000000000300',
    '00000000-0000-0000-0000-000000000200',
    '1.0.0',
    'DRAFT',
    '00000000-0000-0000-0000-000000000100'
)
ON CONFLICT DO NOTHING;

