CREATE TABLE companies (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(14) NOT NULL,
    ativa BOOLEAN NOT NULL DEFAULT TRUE,
    deletado_em TIMESTAMP,
    CONSTRAINT uk_companies_cnpj UNIQUE (cnpj)
);
