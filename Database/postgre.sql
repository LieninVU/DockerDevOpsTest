-- Создание таблицы
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    birth_date DATE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавление администратора с хэшированным паролем
INSERT INTO users (full_name, email, password_hash, role, is_active)
VALUES (
    'Admin',
    'admin@mail.com',
    -- Здесь должен быть реальный хеш пароля, например, от bcrypt
    '$2b$10$6q9z5v7u8i0o9p0l1k2j3h4g5f6d7s8a9z0x1c2v3b4n5m6', -- пример хеша
    'admin',
    TRUE
);
