CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    voice VARCHAR(255) NOT NULL,
    card_id VARCHAR(255) NOT NULL,
    card JSONB,
    status INTEGER,
    time BIGINT,
    time_update BIGINT,
    episode INTEGER,
    season INTEGER,
    profile_id INTEGER REFERENCES profiles(id) ON DELETE SET NULL
); 