DROP TABLE IF EXISTS response_choice CASCADE;
DROP TABLE IF EXISTS poll_response CASCADE;
DROP TABLE IF EXISTS answer_choices CASCADE;
DROP TABLE IF EXISTS polls CASCADE;
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

CREATE TABLE IF NOT EXISTS polls (
  id SERIAL PRIMARY KEY,
  question VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  respond_by TIMESTAMP NOT NULL,
  multiple_choice BOOLEAN DEFAULT FALSE,
  group_id INTEGER REFERENCES groups(id)
);

CREATE TABLE IF NOT EXISTS answer_choices (
  id SERIAL PRIMARY KEY,
  text VARCHAR(255) NOT NULL,
  poll_id INTEGER REFERENCES polls(id)
);

CREATE TABLE IF NOT EXISTS poll_response (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  poll_id INTEGER REFERENCES polls(id)
);

CREATE TABLE IF NOT EXISTS response_choice (
  id SERIAL PRIMARY KEY,
  poll_response_id INTEGER REFERENCES poll_response(id),
  answer_choice_id INTEGER REFERENCES answer_choices(id)
);

CREATE TABLE IF NOT EXISTS user_group (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  group_id INTEGER REFERENCES groups(id),
  is_admin BOOLEAN DEFAULT FALSE
);
-- Dummy data for groups
INSERT INTO groups (name, serialkey)
VALUES 
  ('Group A', 'ABC123'),
  ('Group B', 'DEF456'),
  ('Group C', 'GHI789');

-- Dummy data for users
INSERT INTO users (email, first_name, last_name, username, password)
VALUES 
  ('user1@example.com', 'John', 'Doe', 'johndoe', 'password1'),
  ('user2@example.com', 'Jane', 'Smith', 'janesmith', 'password2'),
  ('user3@example.com', 'Bob', 'Johnson', 'bobjohnson', 'password3');

-- Dummy data for poll
INSERT INTO polls (question, description, respond_by, group_id)
VALUES 
  ('Do you like pizza?', 'This is the first poll', '2023-03-31 23:59:59',  1),
  ('What is your favorite color?', 'This is the second poll', '2023-04-01 23:59:59', 2),
  ('Do you prefer cats or dogs?', 'This is the third poll', '2023-04-02 23:59:59',  3);

-- Dummy data for answer_choices
INSERT INTO answer_choices (text, poll_id)
VALUES 
  ('Yes', 1),
  ('No', 1),
  ('Red', 2),
  ('Blue', 2),
  ('Cats', 3),
  ('Dogs', 3);

-- Dummy data for poll_response
INSERT INTO poll_response (user_id, poll_id)
VALUES 
  (1, 1),
  (2, 1),
  (3, 2);

-- Dummy data for response_choice
INSERT INTO response_choice (poll_response_id, answer_choice_id)
VALUES 
  (1, 1),
  (2, 2),
  (3, 3);

-- Dummy data for user_group
INSERT INTO user_group (user_id, group_id, is_admin)
VALUES 
  (1, 1, true),
  (2, 1, false),
  (3, 2, false);