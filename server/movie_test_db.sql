CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE groups (
    group_id SERIAL PRIMARY KEY,
	admin_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE group_members (
  group_id INT REFERENCES groups(group_id) ON DELETE CASCADE,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'member',
  PRIMARY KEY (group_id, user_id)
);