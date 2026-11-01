-- V1__init_schema.sql
-- MyWardrobe Database Initialization Script

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    preferred_styles TEXT,
    preferred_colours TEXT,
    preferred_occasions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pref_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS clothing_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    display_order INT DEFAULT 0,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS clothing_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    image_path VARCHAR(500) NOT NULL,
    primary_colour VARCHAR(50) NOT NULL,
    secondary_colour VARCHAR(50),
    pattern VARCHAR(50),
    brand VARCHAR(100),
    fabric VARCHAR(100),
    season VARCHAR(50) DEFAULT 'ALL_SEASON',
    style VARCHAR(50) DEFAULT 'CASUAL',
    purchase_date DATE,
    purchase_price DECIMAL(10,2) DEFAULT 0.00,
    availability_status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    is_favourite BOOLEAN NOT NULL DEFAULT FALSE,
    washing_instructions TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_item_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_item_cat FOREIGN KEY (category_id) REFERENCES clothing_categories(id) ON DELETE RESTRICT,
    INDEX idx_user_category (user_id, category_id),
    INDEX idx_user_availability (user_id, availability_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS clothing_item_occasions (
    clothing_item_id BIGINT NOT NULL,
    occasion VARCHAR(50) NOT NULL,
    PRIMARY KEY (clothing_item_id, occasion),
    CONSTRAINT fk_occ_item FOREIGN KEY (clothing_item_id) REFERENCES clothing_items(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS outfits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    occasion VARCHAR(50) NOT NULL,
    season VARCHAR(50) DEFAULT 'ALL_SEASON',
    style VARCHAR(50) DEFAULT 'CASUAL',
    notes TEXT,
    is_favourite BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_outfit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_outfit_user (user_id, occasion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS outfit_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    outfit_id BIGINT NOT NULL,
    clothing_item_id BIGINT NOT NULL,
    outfit_slot VARCHAR(50) NOT NULL,
    display_order INT DEFAULT 0,
    CONSTRAINT fk_oi_outfit FOREIGN KEY (outfit_id) REFERENCES outfits(id) ON DELETE CASCADE,
    CONSTRAINT fk_oi_item FOREIGN KEY (clothing_item_id) REFERENCES clothing_items(id) ON DELETE CASCADE,
    INDEX idx_oi_outfit (outfit_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS outfit_calendar (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    outfit_id BIGINT NOT NULL,
    scheduled_date DATE NOT NULL,
    occasion VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cal_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_cal_outfit FOREIGN KEY (outfit_id) REFERENCES outfits(id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_date (user_id, scheduled_date),
    INDEX idx_cal_user_date (user_id, scheduled_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS wear_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    outfit_id BIGINT,
    clothing_item_id BIGINT,
    worn_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wh_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_wh_outfit FOREIGN KEY (outfit_id) REFERENCES outfits(id) ON DELETE SET NULL,
    CONSTRAINT fk_wh_item FOREIGN KEY (clothing_item_id) REFERENCES clothing_items(id) ON DELETE SET NULL,
    INDEX idx_wh_user (user_id, worn_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS laundry_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    clothing_item_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    CONSTRAINT fk_lr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_lr_item FOREIGN KEY (clothing_item_id) REFERENCES clothing_items(id) ON DELETE CASCADE,
    INDEX idx_lr_user (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
