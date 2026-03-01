CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    birth_date DATE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user',
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO users (first_name, last_name, father_name, email, password_hash, role, is_active)
VALUES (
    'Admin',
    'Admin',
    'Admin',
    'admin@mail.com',

    '$2b$10$6q9z5v7u8i0o9p0l1k2j3h4g5f6d7s8a9z0x1c2v3b4n5m6', 
    'admin',
    TRUE
);

CREATE TABLE session (
    sid VARCHAR NOT NULL,                    
    sess JSON NOT NULL,                      
    expire TIMESTAMP(6) WITH TIME ZONE NOT NULL 
);


ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid);
CREATE INDEX IDX_session_expire ON session(expire);
