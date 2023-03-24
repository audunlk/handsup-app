const HANDSUP_API_URL = "http://192.168.0.106:1903";


export async function createGroup(name, serialkey) {
    const response = await fetch(`${HANDSUP_API_URL}/create-group`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, serialkey }),
    });
    return response.json();
}

export async function createUser(email, password, first_name, last_name, username) {
    try {
        const response = await fetch(`${HANDSUP_API_URL}/create-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, first_name, last_name, username }),
        });
        if (!response.ok) {
            throw new Error(`Failed to create user: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export async function getLoginToken(email, password) {
    const response = await fetch(`${HANDSUP_API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    return response.json();
}

export async function getCurrentUser(user_id) {
    const response = await fetch(`${HANDSUP_API_URL}/currentuser/${user_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

 
export async function updateUser(id, email, first_name, last_name, username) {
    const response = await fetch(`${HANDSUP_API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, first_name, last_name, username }),
    });
    return response.json();
}

export async function listGroupsByKey (serialkey) {
    const response = await fetch(`${HANDSUP_API_URL}/groups/${serialkey}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

export async function getUser(id) {
    const response = await fetch(`${HANDSUP_API_URL}/user/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

//insert using into created group
export async function insertUserIntoGroup(user_id, group_id, is_admin) {
    const response = await fetch(`${HANDSUP_API_URL}/insert-into-group`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, group_id, is_admin }),
    });
    return response.json();
}

//get if user is in group already 
export async function checkUserInGroup(user_id, group_id) {
    const response = await fetch(`${HANDSUP_API_URL}/check-user-group/${user_id}/${group_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

export async function getGroupsByUser(user_id) {
    const response = await fetch(`${HANDSUP_API_URL}/groups-by-user/${user_id}`, {
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


    
