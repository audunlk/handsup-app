const HANDSUP_API_URL = "http://192.168.0.106:1903";

export async function createPoll ( question, description, created_at, respond_by,  group_id, answer_choices) {
    const response = await fetch(`${HANDSUP_API_URL}/create-poll`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, description, created_at, respond_by,  group_id, answer_choices }),
    });
    return response.json();
}

export async function getPollsByGroup(group_id) {
    const response = await fetch(`${HANDSUP_API_URL}/polls-by-group/${group_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

export async function getAnswerChoices(poll_id) {
    const response = await fetch(`${HANDSUP_API_URL}/answer-choices/${poll_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
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


    

