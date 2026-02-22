-- Seed demo tenant
INSERT INTO tenants (name, domain) VALUES 
    ('Acme Corporation', 'acme.stillum.io'),
    ('TechCorp Inc', 'techcorp.stillum.io');

-- Seed roles for Acme
INSERT INTO roles (tenant_id, name, description) VALUES 
    ((SELECT id FROM tenants WHERE domain = 'acme.stillum.io'), 'Admin', 'Administrator with full access'),
    ((SELECT id FROM tenants WHERE domain = 'acme.stillum.io'), 'Manager', 'Can manage artifacts and versions'),
    ((SELECT id FROM tenants WHERE domain = 'acme.stillum.io'), 'Reviewer', 'Can review and approve versions'),
    ((SELECT id FROM tenants WHERE domain = 'acme.stillum.io'), 'Developer', 'Can create and view artifacts');

-- Seed users for Acme
INSERT INTO users (tenant_id, role_id, name, email, password_hash) VALUES 
    ((SELECT id FROM tenants WHERE domain = 'acme.stillum.io'),
     (SELECT id FROM roles WHERE name = 'Admin' AND tenant_id = (SELECT id FROM tenants WHERE domain = 'acme.stillum.io')),
     'Alice Admin', 'alice@acme.stillum.io', '$2a$12$fakehash1'),
    ((SELECT id FROM tenants WHERE domain = 'acme.stillum.io'),
     (SELECT id FROM roles WHERE name = 'Manager' AND tenant_id = (SELECT id FROM tenants WHERE domain = 'acme.stillum.io')),
     'Bob Manager', 'bob@acme.stillum.io', '$2a$12$fakehash2'),
    ((SELECT id FROM tenants WHERE domain = 'acme.stillum.io'),
     (SELECT id FROM roles WHERE name = 'Reviewer' AND tenant_id = (SELECT id FROM tenants WHERE domain = 'acme.stillum.io')),
     'Carol Reviewer', 'carol@acme.stillum.io', '$2a$12$fakehash3');

-- Seed environments for Acme
INSERT INTO environments (tenant_id, name, description) VALUES 
    ((SELECT id FROM tenants WHERE domain = 'acme.stillum.io'), 'Development', 'Development environment'),
    ((SELECT id FROM tenants WHERE domain = 'acme.stillum.io'), 'Staging', 'Staging environment'),
    ((SELECT id FROM tenants WHERE domain = 'acme.stillum.io'), 'Production', 'Production environment');

-- Seed sample artifacts for Acme
INSERT INTO artifacts (tenant_id, type, title, description, owner_id, status, tags, area) VALUES 
    ((SELECT id FROM tenants WHERE domain = 'acme.stillum.io'), 'PROCESS', 
     'Order Processing', 'Main order processing workflow', 
     (SELECT id FROM users WHERE email = 'bob@acme.stillum.io'), 'PUBLISHED', 
     'workflow,orders,core', 'Finance'),
    ((SELECT id FROM tenants WHERE domain = 'acme.stillum.io'), 'RULE',
     'Discount Rules', 'Business rules for discount calculation',
     (SELECT id FROM users WHERE email = 'bob@acme.stillum.io'), 'APPROVED',
     'rules,pricing,discount', 'Sales'),
    ((SELECT id FROM tenants WHERE domain = 'acme.stillum.io'), 'FORM',
     'Customer Registration Form', 'Form for new customer registration',
     (SELECT id FROM users WHERE email = 'bob@acme.stillum.io'), 'DRAFT',
     'forms,customer,registration', 'CRM');

-- Seed artifact versions
INSERT INTO artifact_versions (artifact_id, version, state, created_by, metadata) VALUES 
    ((SELECT id FROM artifacts WHERE title = 'Order Processing'), '1.0.0', 'PUBLISHED',
     (SELECT id FROM users WHERE email = 'bob@acme.stillum.io'), '{"tags":["v1","initial"]}'),
    ((SELECT id FROM artifacts WHERE title = 'Discount Rules'), '1.0.0', 'APPROVED',
     (SELECT id FROM users WHERE email = 'bob@acme.stillum.io'), '{"tags":["v1"]}'),
    ((SELECT id FROM artifacts WHERE title = 'Customer Registration Form'), '1.0.0', 'DRAFT',
     (SELECT id FROM users WHERE email = 'bob@acme.stillum.io'), '{"tags":["v1","beta"]}');

-- Seed publications
INSERT INTO publications (artifact_version_id, environment_id, published_by, notes, release_notes) VALUES 
    ((SELECT id FROM artifact_versions WHERE version = '1.0.0' 
      AND artifact_id = (SELECT id FROM artifacts WHERE title = 'Order Processing')),
     (SELECT id FROM environments WHERE name = 'Production' 
      AND tenant_id = (SELECT id FROM tenants WHERE domain = 'acme.stillum.io')),
     (SELECT id FROM users WHERE email = 'bob@acme.stillum.io'),
     'Initial production release', 'First stable release');
