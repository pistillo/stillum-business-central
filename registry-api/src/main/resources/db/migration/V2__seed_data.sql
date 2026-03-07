-- Seed dev/demo – UUID allineati a Keycloak e publisher. ON CONFLICT DO NOTHING per idempotenza.

INSERT INTO tenant (id, name, domain)
VALUES
    ('1e35dd51-1655-4275-a371-10cf126e209c', 'Tenant A', 'tenant-a'),
    ('0581b81c-ffd0-4135-8103-b67f0e902acd', 'Tenant B', 'tenant-b'),
    ('501384f2-f659-4f85-8ad0-4e24c1789473', 'Demo Tenant', 'demo')
ON CONFLICT (domain) DO NOTHING;

INSERT INTO role (id, tenant_id, name, description)
VALUES
    ('e21c274a-c3cf-44cb-89b5-a6f1a48615ba', '501384f2-f659-4f85-8ad0-4e24c1789473', 'Admin', 'Amministratore del tenant'),
    ('9e802bed-66da-41a9-8fd0-a2063f8ee1db', '501384f2-f659-4f85-8ad0-4e24c1789473', 'Analyst', 'Crea e modifica bozze di artefatti'),
    ('4808dee2-28a6-47ce-aab8-05c09bbabb9f', '501384f2-f659-4f85-8ad0-4e24c1789473', 'ProcessOwner', 'Approva e pubblica artefatti'),
    ('2ccc7d1a-1bc2-4abb-961c-63b88e7f9474', '501384f2-f659-4f85-8ad0-4e24c1789473', 'Viewer', 'Accesso in sola lettura')
ON CONFLICT DO NOTHING;

INSERT INTO app_user (id, tenant_id, role_id, name, email)
VALUES (
    '5dd76d2c-f256-4d25-99e5-995fb2a00cbc',
    '501384f2-f659-4f85-8ad0-4e24c1789473',
    'e21c274a-c3cf-44cb-89b5-a6f1a48615ba',
    'Admin Demo',
    'admin@demo.stillum'
)
ON CONFLICT DO NOTHING;

INSERT INTO environment (id, tenant_id, name, description)
VALUES
    ('95f0e5b6-4bcc-4d4b-bb0c-911f450135ac', '501384f2-f659-4f85-8ad0-4e24c1789473', 'DEV', 'Sviluppo'),
    ('a43cb8da-6196-4631-97df-1360ec747841', '501384f2-f659-4f85-8ad0-4e24c1789473', 'QA', 'Quality Assurance'),
    ('b40145d6-46a2-41ff-a620-c72d967621d4', '501384f2-f659-4f85-8ad0-4e24c1789473', 'PROD', 'Produzione')
ON CONFLICT DO NOTHING;

INSERT INTO environment (id, tenant_id, name, description)
VALUES
    ('7f4e84c4-2b41-4933-acaa-da37624ff720', '1e35dd51-1655-4275-a371-10cf126e209c', 'DEV', 'Sviluppo'),
    ('a3a7b1cb-1616-4ddb-880a-57e75a2944c7', '1e35dd51-1655-4275-a371-10cf126e209c', 'QA', 'Quality Assurance'),
    ('df686862-3c03-4e36-9fbe-2075bfd1b2bd', '1e35dd51-1655-4275-a371-10cf126e209c', 'PROD', 'Produzione')
ON CONFLICT DO NOTHING;

