CREATE TABLE secrets(
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    base32 TEXT NOT NULL,
    otpauth_url TEXT NOT NULL,
    verified Boolean,
    FOREIGN KEY (user_id) REFERENCES users(id)
);