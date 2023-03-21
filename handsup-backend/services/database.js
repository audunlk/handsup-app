const { Pool } = require("pg");

const POSTGRES_URL = process.env.POSTGRES_URL || "postgresql://postgres:387456@localhost:5432/handsup";

const database = new Pool({
    connectionString: POSTGRES_URL,
});
// Database for a polling app called HandsUp
 
async function createGroup(name, serialkey) {
    const result = await database.query(
        `
        INSERT INTO groups (name, serialkey)
        VALUES ($1, $2)
        RETURNING *;
        `, 
        [name, serialkey]
    ); 
    return result.rows[0]; 
} 

//get user by id
async function getUser (id) {
    const result = await database.query(
        `
        SELECT * FROM users
        WHERE id = $1;
        `,
        [id]
    );
    return result.rows[0];
}   

//get user by email
async function getUserByEmail (email) {
    const result = await database.query(
        `
        SELECT * FROM users
        WHERE email = $1;
        `,
        [email]
    );
    return result.rows[0];
}


async function createUser(email, password, first_name, last_name, username) {
    const result = await database.query(
        `
        INSERT INTO users (email, password, first_name, last_name, username)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
        [email, password, first_name, last_name, username]
    );
    return result.rows[0];
}

async function listGroupsByKey(serialkey) {
    const result = await database.query(
        `
        SELECT * FROM groups
        WHERE serialkey = $1; 
        `,
        [serialkey]
    );
    return result.rows[0];
}

async function updateUser(id, email, first_name, last_name, username) {
    const result = await database.query(
        `
        UPDATE users
        SET email = $2, first_name = $3, last_name = $4, username = $5
        WHERE id = $1
        RETURNING *;
        `,
        [id, email, first_name, last_name, username]
    );
    return result.rows[0];
}

async function createUserGroup(user_id, group_id, is_admin) {
    const result = await database.query(
        `
        INSERT INTO user_group (user_id, group_id, is_admin)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
        [user_id, group_id, is_admin]
    );
    return result.rows[0];
}

async function checkUserInGroup(user_id, group_id) {
    const result = await database.query(
        `
        SELECT * FROM user_group
        WHERE user_id = $1 AND group_id = $2
        `,
        [user_id, group_id]
    );
    return result.rows; 
}

async function getGroupsByUser(user_id) {
    const result = await database.query(
        // also get admin status from groups table
        `
        SELECT groups.id, groups.name, groups.serialkey, user_group.is_admin
        FROM groups
        JOIN user_group ON groups.id = user_group.group_id
        WHERE user_group.user_id = $1;
        `,
        [
            user_id
        ]
    );
    return result.rows;
}

async function getPollsByUser(user_id) {
    const result = await database.query(
        `
        SELECT polls.id, polls.title, polls.description, polls.respond_by, polls.user_id, users.username
        FROM polls
        JOIN users ON polls.user_id = users.id
        WHERE polls.user_id = $1;
        `,
        [
            user_id
        ]
    );
    return result.rows;
}

// export async function getPollsByUser(user_id) {
//     const response = await fetch(`${HANDSUP_API_URL}/polls-by-user/${user_id}`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });
//     return response.json();
// }



// async function getPollsByUser(user_id) {
//     const result = await database.query(
//         `
//         SELECT polls.id, polls.title, polls.description, polls.is_open, polls.created_at, polls.updated_at, polls.user_id, users.username
//         FROM polls
//         JOIN users ON polls.user_id = users.id
//         WHERE polls.user_id = $1;
//         `,
//         [
//             user_id
//         ]
//     );
//     return result.rows;
// }

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


    










module.exports = {
    createGroup,
    getUser,
    createUser,
    listGroupsByKey,
    updateUser,
    createUserGroup,
    checkUserInGroup,
    getUserByEmail,
    getGroupsByUser,
    getPollsByUser,
};
