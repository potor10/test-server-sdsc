const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');
const port = 1337;
const sqlite3 = require('sqlite3').verbose();

const client = {};
client.commands = new Map();

fs.readdirSync('./commands').forEach(dirs => {
  const commands = fs.readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));

  for (const file of commands) {
      const command = require(`./commands/${dirs}/${file}`);
      console.log(`LOG: Loading command ${file}`);
      client.commands.set(command.name.toLowerCase(), command);
  };
});

// Load Site Assets
app.use(express.static(__dirname + '/site/static'));

// Body Parser
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/site/index.html');
});

app.post('/', (req, res) => {
  if (req.body['command']) {
    console.log(`Executing command: ${req.body['command']}`);
    const cmd = client.commands.get(req.body['command']);
    if (cmd) cmd.execute(req, res)
    else console.log(`Could not find command: ${req.body['command']}`);
  }
});

let db = new sqlite3.Database('./db/leaderboard.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
db.serialize(function() {
  db.run(" CREATE TABLE IF NOT EXISTS leaderboard (score INTEGER, name TEXT NOT NULL, date TEXT) ");
});

//close db access
db.close();

const server = http.createServer(app)
    .listen(process.env.PORT || port, () => {
        console.log('Running on http://localhost:' + port);
    });