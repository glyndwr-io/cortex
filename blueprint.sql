CREATE EXTENSION pgcrypto;
--Permissions
-- 0: Admin       - All Actions
-- 1: Manager     - Users, Keys, Models, Datasets
-- 2: Developer   - Keys, Models, Datasets
-- 3: User        - Models, Datasets
-- 4: Contributor - Datasets
CREATE TABLE user_accounts (
    id          SERIAL UNIQUE NOT NULL PRIMARY KEY,
    org_id      TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    first_name  TEXT NOT NULL,
    last_name   TEXT NOT NULL,
    permission  INTEGER NOT NULL
);

CREATE TABLE datasets (
    id              SERIAL UNIQUE NOT NULL,
    org_id          TEXT NOT NULL,
    title           TEXT NOT NULL,
    slug            TEXT NOT NULL,
    description     TEXT NOT NULL,
    image           TEXT,
    author_id       INTEGER NOT NULL,
    classes         TEXT[]
);

CREATE TABLE models (
    id              SERIAL UNIQUE NOT NULL,
    org_id          TEXT NOT NULL,
    dataset_id      INTEGER NOT NULL,
    title           TEXT NOT NULL,
    slug            TEXT NOT NULL,
    description     TEXT NOT NULL,
    image           TEXT,
    author_id       INTEGER NOT NULL,
    needs_retrain   BOOLEAN NOT NULL,
    is_training     BOOLEAN NOT NULL
);
CREATE TABLE model_updates (
    id              SERIAL UNIQUE NOT NULL,
    model_id        INTEGER NOT NULL,
    epoch           INTEGER NOT NULL,
    val_accuracy    DOUBLE PRECISION NOT NULL,
    val_loss        DOUBLE PRECISION NOT NULL,
    train_accuracy  DOUBLE PRECISION NOT NULL,
    train_loss      DOUBLE PRECISION NOT NULL
);

CREATE TABLE api_keys (
    id              SERIAL UNIQUE NOT NULL,
    public_key      TEXT NOT NULL UNIQUE,
    private_key     TEXT NOT NULL,
    user_id         INTEGER NOT NULL,
    created         TIMESTAMP NOT NULL DEFAULT NOW(),
    last_activity   TIMESTAMP NOT NULL DEFAULT NOW(),
    permission      INTEGER NOT NULL
);

CREATE TABLE api_activity (
    id              SERIAL UNIQUE NOT NULL,
    key_id          INTEGER NOT NULL,
    method          TEXT NOT NULL,
    endpoint        TEXT NOT NULL,
    description     TEXT NOT NULL,
    timestamp       TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO user_accounts (org_id, email, password, first_name, last_name, permission)
VALUES (
    '6fa459ea-ee8a-3ca4-894e-db77e160355e',
    'john.doe@acme.ca',
    crypt('test', gen_salt('bf')),
    'John',
    'Doe',
    0
);