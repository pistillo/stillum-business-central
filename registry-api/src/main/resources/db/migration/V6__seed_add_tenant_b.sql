INSERT INTO tenant (id, name, domain)
VALUES ('00000000-0000-0000-0000-000000000002', 'Tenant B', 'tenant-b')
ON CONFLICT (domain) DO NOTHING;
