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
    try{
        const user = await database.getUserByEmail(email);
        console.log(user + "user from server.js")
        if (!user) {
            res.status(401).send({ error: "User not found." });
            return;
        }  
        console.log(user.password + "password from server.js")
        console.log("passed user.password")
        if (password != user.password) {
            res.status(401).send({ error: "Wrong email and password combination." });
            return;
        }
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            password: user.password,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
        }, Buffer.from(secret, "base64"))
        console.log(token)

        res.json({
            token : token
        });
    } catch (error) {
        res.status(500).send({ error: "Failed to login" })
    }
});

//create user
app.post("/create-user", async (req, res) => {
    const { email, password, first_name, last_name, username } = req.body;
    try{
        const user = await database.createUser(email, password, first_name, last_name, username);
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: `Failed to create user: ${error.message}` });
    }
});

//get user by id
app.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    const user = await database.getUser(id);
    res.json(user);
});


//create group
app.post("/create-group", async (req, res) => {
    const { name, serialkey } = req.body;
    const group = await database.createGroup(name, serialkey);
    res.json(group);
  }); 

//get group by serialkey
app.get('/groups/:serialkey', async (req, res) => {
    const { serialkey } = req.params;
    const groups = await database.listGroupsByKey(serialkey);
    res.json(groups);
});

//update user by id
app.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { email, first_name, last_name, username } = req.body;
    const user = await database.updateUser(id, email, first_name, last_name, username);
    res.json(user);
});
 
//insert user into group
app.post("/insert-into-group", async (req, res) => {
    const { user_id, group_id, is_admin } = req.body;
    const userGroup = await database.createUserGroup(user_id, group_id, is_admin);
    res.json(userGroup);
});


//check if user is in group
app.get('/check-user-group/:user_id/:group_id', async (req, res) => {
    const { user_id, group_id } = req.params;
    const userGroup = await database.checkUserInGroup(user_id, group_id);
    res.json(userGroup);
});
 

app.get('/groups-by-user/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const groups = await database.getGroupsByUser(user_id);
    res.json(groups); 
});    
  
//create poll
app.post("/create-poll", async (req, res) => {
    const { question, description, created_at, respond_by,  group_id, answer_choices} = req.body;
    const poll = await database.createPoll( question, description, created_at, respond_by,  group_id, answer_choices);
    res.json(poll);
});



//get polls by group
app.get('/polls-by-group/:group_id', async (req, res) => {
    const { group_id } = req.params;
    const polls = await database.getPollsByGroup(group_id);
    res.json(polls);
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


    
 