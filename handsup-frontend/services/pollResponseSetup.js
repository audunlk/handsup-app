const HANDSUP_API_URL = "http://192.168.0.106:1903";


export async function createPollResponse(poll_id, user_id){
    const response = await fetch(`${HANDSUP_API_URL}/create-poll-response/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ poll_id, user_id }),
    });
    return response.json();
}

export async function insertResponseChoice(poll_response_id, choice_id){
    const response = await fetch(`${HANDSUP_API_URL}/insert-response-choice/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ poll_response_id, choice_id }),
    });
    return response.json();
}

// -- Create tables
// CREATE TABLE IF NOT EXISTS groups (
//   id SERIAL PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   serialkey VARCHAR(255) NOT NULL
// ); 

// CREATE TABLE IF NOT EXISTS users (
//   id SERIAL PRIMARY KEY,
//   email VARCHAR(255) NOT NULL,
//   first_name VARCHAR(255) NOT NULL,
//   last_name VARCHAR(255) NOT NULL,
//   username VARCHAR(255) NOT NULL,
//   password VARCHAR(255) NOT NULL,
//   timestamp TIMESTAMP DEFAULT NULL
// );

// CREATE TABLE IF NOT EXISTS questionnaire (
//   id SERIAL PRIMARY KEY,
//   title VARCHAR(255) NOT NULL
// );

// CREATE TABLE IF NOT EXISTS questions (
//   id SERIAL PRIMARY KEY,
//   text VARCHAR(255) NOT NULL,
//   questionnaire_id INTEGER REFERENCES questionnaire(id)
// );

// CREATE TABLE IF NOT EXISTS choices (
//   id SERIAL PRIMARY KEY,
//   text VARCHAR(255) NOT NULL,
//   question_id INTEGER REFERENCES questions(id)
// );

// CREATE TABLE IF NOT EXISTS polls (
//   id SERIAL PRIMARY KEY,
//   title VARCHAR(255) NOT NULL,
//   description TEXT,
//   respond_by TIMESTAMP NOT NULL,
//   questionnaire_id INTEGER REFERENCES questionnaire(id)
// );

// CREATE TABLE IF NOT EXISTS poll_response (
//   id SERIAL PRIMARY KEY,
//   user_id INTEGER REFERENCES users(id),
//   poll_id INTEGER REFERENCES polls(id)
// );

// CREATE TABLE IF NOT EXISTS user_group (
//   id SERIAL PRIMARY KEY,
//   user_id INTEGER REFERENCES users(id),
//   group_id INTEGER REFERENCES groups(id),
//   is_admin BOOLEAN DEFAULT FALSE
// );

// CREATE TABLE IF NOT EXISTS response_choice (
//   id SERIAL PRIMARY KEY,
//   poll_response_id INTEGER REFERENCES poll_response(id),
//   choice_id INTEGER REFERENCES choices(id)
// );
