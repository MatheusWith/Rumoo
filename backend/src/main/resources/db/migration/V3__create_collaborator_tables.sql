CREATE TABLE collaborators (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company_id BIGINT NOT NULL REFERENCES companies (id),
    keycloak_sub VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uk_collaborators_company_email UNIQUE (company_id, email),
    CONSTRAINT uk_collaborators_keycloak_sub UNIQUE (keycloak_sub)
);

CREATE TABLE groups (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company_id BIGINT NOT NULL REFERENCES companies (id),
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE group_memberships (
    collaborator_id BIGINT NOT NULL REFERENCES collaborators (id),
    group_id BIGINT NOT NULL REFERENCES groups (id),
    role VARCHAR(20) NOT NULL,
    PRIMARY KEY (collaborator_id, group_id),
    CONSTRAINT chk_group_memberships_role CHECK (role IN ('MEMBER', 'LEADER'))
);