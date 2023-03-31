require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const database = require("./services/database");

const PORT = 1903;
const secret = "secret";

app.use(cors());
app.use(express.json());

//jwt token
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await database.getUserByEmail(email);
    console.log(user + "user from server.js");
    if (!user) {
      res.status(401).send({ error: "User not found." });
      return;
    }
    console.log(user.password + "password from server.js");
    if (password != user.password) {
      res.status(401).send({ error: "Wrong email and password combination." });
      return;
    }else{
        console.log("passwords match");
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        password: user.password,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
      },
      Buffer.from(secret, "base64")
    );
    console.log({token});

    res.json({
      token,
    });
  } catch (error) {
    res.status(500).send({ error: "Failed to login" });
  }
});

//create user
app.post("/create-user", async (req, res) => {
  const { email, password, first_name, last_name, username } = req.body;
  try {
    const user = await database.createUser(
      email,
      password,
      first_name,
      last_name,
      username
    );
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: `Failed to create user: ${error.message}` });
  }
});

//get user by id
app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await database.getUser(id);
    res.json(user);
  } catch (error) {
    res.status(500).send({ error: `Failed to get user: ${error.message}` });
  }
});

//create group
app.post("/create-group", async (req, res) => {
  const { name, serialkey } = req.body;
  try {
    const group = await database.createGroup(name, serialkey);
    res.json(group);
  } catch (error) {
    res.status(500).send({ error: `Failed to create group: ${error.message}` });
  }
});

//get group by serialkey
app.get("/groups/:serialkey", async (req, res) => {
  const { serialkey } = req.params;
  try {
    const groups = await database.listGroupsByKey(serialkey);
    res.json(groups);
  } catch (error) {
    res.status(500).send({ error: `Failed to get group: ${error.message}` });
  }
});

//update user by id
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { email, first_name, last_name, username } = req.body;
  try {
    const user = await database.updateUser(
      id,
      email,
      first_name,
      last_name,
      username
    );
    res.json(user);
  } catch (error) {
    res.status(500).send({ error: `Failed to update user: ${error.message}` });
  }
});

//insert user into group
app.post("/insert-into-group", async (req, res) => {
  const { user_id, group_id, is_admin } = req.body;
  try {
    const userGroup = await database.createUserGroup(
      user_id,
      group_id,
      is_admin
    );
    res.json(userGroup);
  } catch (error) {
    res
      .status(500)
      .send({ error: `Failed to insert user into group: ${error.message}` });
  }
});

//check if user is in group
app.get("/check-user-group/:user_id/:group_id", async (req, res) => {
  const { user_id, group_id } = req.params;
  try {
    const userGroup = await database.checkUserInGroup(user_id, group_id);
    res.json(userGroup);
  } catch (error) {
    res
      .status(500)
      .send({ error: `Failed to check user in group: ${error.message}` });
  }
});

app.get("/groups-by-user/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const groups = await database.getGroupsByUser(user_id);
    res.json(groups);
  } catch (error) {
    res.status(500).send({ error: `Failed to get groups: ${error.message}` });
  }
});

//create poll
app.post("/create-poll", async (req, res) => {
  const {
    question,
    
    created_at,
    respond_by,
    group_id,
    answer_choices,
  } = req.body;
  try {
    const poll = await database.createPoll(
      question,
      
      created_at,
      respond_by,
      group_id,
      answer_choices
    );
    res.json(poll);
  } catch (error) {
    res.status(500).send({ error: `Failed to create poll: ${error.message}` });
  }
});

//get polls by group
app.get("/polls-by-group/:group_id", async (req, res) => {
  const { group_id } = req.params;
  try {
    const polls = await database.getPollsByGroup(group_id);
    res.json(polls);
  } catch (error) {
    res.status(500).send({ error: `Failed to get polls: ${error.message}` });
  }
});

//get answers by pollID
app.get("/answer-choices/:poll_id", async (req, res) => {
  const { poll_id } = req.params;
  try {
    const answers = await database.getAnswerChoices(poll_id);
    res.json(answers);
  } catch (error) {
    res.status(500).send({ error: `Failed to get answers: ${error.message}` });
  }
});

//get all polls based on group ids(array)
app.get("/polls-by-groups/:group_ids", async (req, res) => {
  const { group_ids } = req.params;
  try {
    const polls = await database.getPollsByGroups(group_ids);
    res.json(polls);
  } catch (error) {
    res.status(500).send({ error: `Failed to get polls: ${error.message}` });
  }
});

//delete selected poll
app.delete("/delete-poll/:poll_id", async (req, res) => {
  const { poll_id } = req.params;
  try {
    const poll = await database.deletePoll(poll_id);
    res.json(poll);
  } catch (error) {
    res.status(500).send({ error: `Failed to delete poll: ${error.message}` });
  }
});

app.get("/admins-by-group/:group_id", async (req, res) => {
  const { group_id } = req.params;
  try {
    const admins = await database.getAdminsByGroup(group_id);
    res.json(admins);
  } catch (error) {
    res.status(500).send({ error: `Failed to get admins: ${error.message}` });
  }
});

app.listen(PORT, "192.168.0.106", () => {
  console.log(`Server is running on http://192.168.0.106:${PORT}`);
});

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
//   TEXT,
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
