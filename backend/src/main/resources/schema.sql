-- Tabela de usuarios conforme o enunciado (id como INT4 / SERIAL).
CREATE TABLE IF NOT EXISTS usuarios (
    id    SERIAL       PRIMARY KEY,
    nome  VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);
