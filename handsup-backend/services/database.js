const { Pool } = require("pg");

const POSTGRES_URL =
  process.env.POSTGRES_URL ||
  "postgresql://postgres:387456@localhost:5432/handsup";

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
async function getUser(id) {
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
async function getUserByEmail(email) {
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
    [user_id]
  );
  return result.rows;
}

//create poll
async function createPoll(
  question,
  created_at,
  respond_by,
  group_id,
  answer_choices
) {
  const client = await database.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `
            INSERT INTO polls (question, created_at, respond_by, group_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
            `,
      [question, created_at, respond_by, group_id]
    );
    const poll_id = result.rows[0].id;

    const values = answer_choices.map((answer_choice) => {
      return [answer_choice, poll_id];
    });
    const result2 = await client.query(
      `
            INSERT INTO answer_choices (text, poll_id)
            VALUES ${values
              .map((value, index) => `($${index * 2 + 1}, $${index * 2 + 2})`)
              .join(", ")}
            RETURNING *;
            `,
      values.flat()
    );
    await client.query("COMMIT");
    console.log(result2.rows);
    return result2.rows;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function getPollsByGroup(group_id) {
  try {
    const result = await database.query(
      `
            SELECT polls.id, polls.created_at, polls.respond_by, polls.question, polls.group_id, groups.name, groups.serialkey
            FROM polls
            JOIN groups ON polls.group_id = groups.id
            WHERE polls.group_id = $1;
            `,
      [group_id]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}

async function getAnswerChoices(poll_id) {
  const result = await database.query(
    `
        SELECT * FROM answer_choices
        WHERE poll_id = $1;
        `,
    [poll_id]
  );
  return result.rows;
}

async function getPollsByGroups(group_ids) {
  const result = await database.query(
    `
        SELECT polls.id, polls.created_at, polls.respond_by, polls.question, polls.group_id, groups.name, groups.serialkey
        FROM polls
        JOIN groups ON polls.group_id = groups.id
        WHERE polls.group_id IN (${group_ids});
        `
  );
  console.log(result.rows);
  return result.rows;
}

async function deletePoll(poll_id) {
  const result = await database.query(
    `
        DELETE FROM polls
        WHERE id = $1
        RETURNING *;
        `,
    [poll_id]
  );
  return result.rows[0];
}

//given a group_id in Poll return all users where is_admin = true
async function getAdminsByGroup(group_id) {
  const result = await database.query(
    `
        SELECT users.id, users.email, users.first_name, users.last_name, users.username
        FROM users
        JOIN user_group ON users.id = user_group.user_id
        WHERE user_group.group_id = $1 AND user_group.is_admin = true;
        `,
    [group_id]
  );
  return result.rows;
}


//createPollResponse
async function createPollResponse(user_id, poll_id) {
    const result = await database.query(
        `
        INSERT INTO poll_response (user_id, poll_id)
        VALUES ($1, $2)
        RETURNING *;
        `,
        [user_id, poll_id]
    );
    return result.rows[0];
}

//createResponseChoice
async function insertResponseChoice(poll_response_id, answer_choice_id) {
    const result = await database.query(
        `
        INSERT INTO response_choice (poll_response_id, answer_choice_id)
        VALUES ($1, $2)
        RETURNING *;
        `,
        [poll_response_id, answer_choice_id]
    );
    return result.rows[0];
}



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
  createPoll,
  getPollsByGroup,
  getAnswerChoices,
  getPollsByGroups,
  deletePoll,
  getAdminsByGroup,
    createPollResponse,
    insertResponseChoice
};


// DROP TABLE IF EXISTS response_choice CASCADE;
// DROP TABLE IF EXISTS poll_response CASCADE;
// DROP TABLE IF EXISTS answer_choices CASCADE;
// DROP TABLE IF EXISTS polls CASCADE;
// DROP TABLE IF EXISTS user_group CASCADE;
// DROP TABLE IF EXISTS users CASCADE;
// DROP TABLE IF EXISTS groups CASCADE;

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

//   CREATE TABLE IF NOT EXISTS polls (
//     id SERIAL PRIMARY KEY,
//     question VARCHAR(255) NOT NULL,
//     created_at TIMESTAMP DEFAULT NOW(),
//     respond_by TIMESTAMP NOT NULL,
//     multiple_choice BOOLEAN DEFAULT FALSE,
//     group_id INTEGER REFERENCES groups(id)
//   );

// CREATE TABLE IF NOT EXISTS answer_choices (
//   id SERIAL PRIMARY KEY,
//   text VARCHAR(255) NOT NULL,
//   poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE
// );

// CREATE TABLE IF NOT EXISTS poll_response (
//   id SERIAL PRIMARY KEY,
//   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//   poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE
// );

// CREATE TABLE IF NOT EXISTS response_choice (
//   id SERIAL PRIMARY KEY,
//   poll_response_id INTEGER REFERENCES poll_response(id) ON DELETE CASCADE,
//   answer_choice_id INTEGER REFERENCES answer_choices(id) ON DELETE CASCADE
// );

// CREATE TABLE IF NOT EXISTS user_group (
//   id SERIAL PRIMARY KEY,
//   user_id INTEGER REFERENCES users(id),
//   group_id INTEGER REFERENCES groups(id),
//   is_admin BOOLEAN DEFAULT FALSE
// );
// -- Dummy data for groups
// INSERT INTO groups (name, serialkey)
// VALUES 
//   ('Group A', 'ABC123'),
//   ('Group B', 'DEF456'),
//   ('Group C', 'GHI789');

// -- Dummy data for users
// INSERT INTO users (email, first_name, last_name, username, password)
// VALUES 
//   ('user1@example.com', 'John', 'Doe', 'johndoe', 'password1'),
//   ('user2@example.com', 'Jane', 'Smith', 'janesmith', 'password2'),
//   ('user3@example.com', 'Bob', 'Johnson', 'bobjohnson', 'password3');

// -- Dummy data for poll
// INSERT INTO polls (question, respond_by, group_id)
// VALUES 
//   ('Do you like pizza?',  '2023-03-31 23:59:59',  1),
//   ('What is your favorite color?',  '2023-04-01 23:59:59', 2),
//   ('Do you prefer cats or dogs?', '2023-04-02 23:59:59',  3);

// -- Dummy data for answer_choices
// INSERT INTO answer_choices (text, poll_id)
// VALUES 
//   ('Yes', 1),
//   ('No', 1),
//   ('Red', 2),
//   ('Blue', 2),
//   ('Cats', 3),
//   ('Dogs', 3);

// -- Dummy data for poll_response
// INSERT INTO poll_response (user_id, poll_id)
// VALUES 
//   (1, 1),
//   (2, 1),
//   (3, 2);

// -- Dummy data for response_choice
// INSERT INTO response_choice (poll_response_id, answer_choice_id)
// VALUES 
//   (1, 1),
//   (2, 2),
//   (3, 3);

// -- Dummy data for user_group
// INSERT INTO user_group (user_id, group_id, is_admin)
// VALUES 
//   (1, 1, true),
//   (2, 1, false),
//   (3, 2, false);

