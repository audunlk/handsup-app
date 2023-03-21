DROP TABLE IF EXISTS response_choice CASCADE;
DROP TABLE IF EXISTS poll_response CASCADE;
DROP TABLE IF EXISTS choice CASCADE;
DROP TABLE IF EXISTS question CASCADE;
DROP TABLE IF EXISTS poll CASCADE;
DROP TABLE IF EXISTS questionnaire CASCADE;
DROP TABLE IF EXISTS user_group CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS groups CASCADE;

-- Create tables
CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  serialkey VARCHAR(255) NOT NULL
); 

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS poll (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  respond_by TIMESTAMP NOT NULL,
  question VARCHAR(255) NOT NULL,
  multiple_choice BOOLEAN DEFAULT FALSE,
  group_id INTEGER REFERENCES groups(id)
);

CREATE TABLE IF NOT EXISTS question (
  id SERIAL PRIMARY KEY,
  text VARCHAR(255) NOT NULL,
  poll_id INTEGER REFERENCES poll(id)
);

CREATE TABLE IF NOT EXISTS choice (
  id SERIAL PRIMARY KEY,
  text VARCHAR(255) NOT NULL,
  question_id INTEGER REFERENCES question(id)
);

CREATE TABLE IF NOT EXISTS poll_response (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  poll_id INTEGER REFERENCES poll(id)
);

CREATE TABLE IF NOT EXISTS response_choice (
  id SERIAL PRIMARY KEY,
  poll_response_id INTEGER REFERENCES poll_response(id),
  choice_id INTEGER REFERENCES choice(id)
);

CREATE TABLE IF NOT EXISTS user_group (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  group_id INTEGER REFERENCES groups(id),
  is_admin BOOLEAN DEFAULT FALSE
);
-- Insert dummy data
INSERT INTO groups (name, serialkey) VALUES
  ('Group A', 'abc123'),
  ('Group B', 'def456'),
  ('Group C', 'ghi789');

-- Insert some example users
INSERT INTO users (email, first_name, last_name, username, password, timestamp) VALUES
  ('user1@example.com', 'John', 'Doe', 'jdoe', 'password123', '2023-03-20 12:34:56'),
  ('user2@example.com', 'Jane', 'Smith', 'jsmith', 'password456', '2023-03-19 09:08:07'),
  ('user3@example.com', 'Bob', 'Johnson', 'bjohnson', 'password789', NULL);


-- Insert a polls referencing the questionnaire
INSERT INTO poll (title, description, respond_by, question, group_id) VALUES
  ('Example Poll', 'This is an example poll', '2023-03-20 12:34:56', 'Are you alive?', 1);
-- Insert a question referencing the poll
INSERT INTO question (text, poll_id) VALUES ('Are you alive?', 1);

-- Insert some example choices for the question
INSERT INTO choice (text, question_id) VALUES
  ('Yes', 1),
  ('No', 1),
  ('Maybe', 1);

-- Insert a response to the poll from the first user
INSERT INTO poll_response (user_id, poll_id) VALUES (1, 1);

-- Insert the user's choices for the response
INSERT INTO response_choice (poll_response_id, choice_id) VALUES
  (1, 1),
  (1, 3);

-- Add some example user groups
INSERT INTO user_group (user_id, group_id, is_admin) VALUES
  (1, 1, true),
  (1, 2, false),
  (2, 2, true),
  (2, 3, false);
