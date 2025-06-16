-- init.sql (place in my-fullstack-app/)
-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    premium_days INTEGER DEFAULT 0,
    n_movie INTEGER DEFAULT 1,
    n_tv INTEGER DEFAULT 1,
    n_voice INTEGER DEFAULT 1,
    premium INTEGER DEFAULT 0,
    backup INTEGER DEFAULT 0,
    permission INTEGER DEFAULT 0,
    bet VARCHAR(255) DEFAULT '',
    payout INTEGER DEFAULT 0,
    profile INTEGER -- Foreign key to profiles table
);

CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    main INTEGER DEFAULT 0,
    icon VARCHAR(255) DEFAULT 'l_1'
);

ALTER TABLE users ADD CONSTRAINT fk_profile
FOREIGN KEY (profile) REFERENCES profiles(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS access_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(6) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    device_code VARCHAR(255) UNIQUE NOT NULL,
    access_token VARCHAR(255) NOT NULL,
    profile_id INTEGER NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    profile_id INTEGER NOT NULL REFERENCES profiles(id),
    type VARCHAR(50) NOT NULL,
    data JSONB NOT NULL,
    card_id VARCHAR(255) NOT NULL,
    time BIGINT NOT NULL,
    CONSTRAINT unique_bookmark UNIQUE (card_id, user_id, profile_id)
);

CREATE TABLE IF NOT EXISTS reactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    content_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_reaction UNIQUE (user_id, content_id, type)
);

CREATE TABLE IF NOT EXISTS notices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    profile_id INTEGER NOT NULL REFERENCES profiles(id),
    message TEXT NOT NULL,
    is_cleared BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    profile_id INTEGER NOT NULL REFERENCES profiles(id),
    voice VARCHAR(255),
    card_id VARCHAR(255) NOT NULL,
    card JSONB,
    status INTEGER DEFAULT 1,
    time BIGINT NOT NULL,
    time_update BIGINT NOT NULL,
    episode INTEGER DEFAULT 1,
    season INTEGER DEFAULT 1,
    CONSTRAINT unique_notification UNIQUE (user_id, profile_id, card_id)
);
