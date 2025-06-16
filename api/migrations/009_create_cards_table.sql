CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    season_info JSONB
); 