-- Deterministic, idempotent seed for the rumoo dev database.
-- Safe to run repeatedly: every insert uses ON CONFLICT DO NOTHING.

-- Companies
INSERT INTO companies (id, name, cnpj, active) VALUES
    (1, 'Rumoo SA', '12345678000199', TRUE),
    (2, 'Acme Ltda', '12345678000200', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Groups (Time)
INSERT INTO groups (id, name, company_id, active) VALUES
    (1, 'Marketing',   1, TRUE),
    (2, 'Product',     1, TRUE),
    (3, 'Engineering', 2, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Collaborators. keycloakSub is NULL here; the seed entrypoint backfills the
-- two collaborators that have a matching Keycloak user.
INSERT INTO collaborators (id, name, email, company_id, keycloak_sub, active) VALUES
    (1, 'Alice Alves', 'alice@rumoo.com',  1, NULL, TRUE),
    (2, 'Bruno Barros', 'bruno@rumoo.com', 1, NULL, TRUE),
    (3, 'Carla Costa', 'carla@rumoo.com',  1, NULL, TRUE),
    (4, 'Daniel Dias', 'daniel@acme.io',   2, NULL, TRUE),
    (5, 'Elisa Almeida', 'elisa@acme.io',  2, NULL, TRUE),
    (6, 'Carol Castro', 'carol@acme.io',   2, NULL, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Group memberships (composite key)
INSERT INTO group_memberships (collaborator_id, group_id, role) VALUES
    (1, 1, 'LEADER'),
    (1, 2, 'MEMBER'),
    (2, 1, 'MEMBER'),
    (2, 2, 'LEADER'),
    (3, 1, 'MEMBER'),
    (4, 3, 'LEADER'),
    (5, 3, 'MEMBER'),
    (6, 3, 'MEMBER')
ON CONFLICT (collaborator_id, group_id) DO NOTHING;