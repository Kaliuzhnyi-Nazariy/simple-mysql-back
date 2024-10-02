const express = require("express");
const mysql = require("mysql");
require("dotenv").config();

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;
console;

const app = express();

app.use(express.json());

const db = mysql.createConnection({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
});

app.get("/", (req, res) => {
  res.send(`<h1>Back is ready for work</h1>`);
});

app.get("/all", (req, res) => {
  const q = "SELECT * from gg";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get(`/all/:id`, (req, res) => {
  const q = "SELECT * from gg where id = ?";
  const { id } = req.params;
  db.query(q, id, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

const findById = (id) => {
  const q = "SELECT * from gg where id = ?";

  return new Promise((resolve, reject) => {
    db.query(q, [id], (err, data) => {
      if (err) return reject(err);
      resolve(data[0]);
    });
  });
};

app.post("/all/post", (req, res) => {
  const q =
    "INSERT INTO gg (`date`, `username`, `tasks`, `taskArray`)  VALUES ( ?, ?, ?, ?)";
  const { date, username, tasks, taskArray } = req.body;

  db.query(
    q,
    [date, username, tasks, JSON.stringify(taskArray)],
    async (err, data) => {
      if (err) return res.json(err);
      const newValue = await findById(data.insertId);
      res.json(newValue);
    }
  );
});

app.put("/all/:id", (req, res) => {
  const q =
    "UPDATE gg SET date = ?, username = ?, tasks = ?, taskArray = ? WHERE id = ?";
  const { date, username, tasks, taskArray } = req.body;
  const { id } = req.params;

  db.query(
    q,
    [date, username, tasks, JSON.stringify(taskArray), id],
    async (err, data) => {
      if (err) return res.json(err);
      const newValue = await findById(id);
      return res.json(newValue);
    }
  );
});

app.delete("/all/:id", (req, res) => {
  const q = "Delete from gg where id = ?";
  const { id } = req.params;

  db.query(q, id, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.listen(3002, () => {
  console.log("Connected!");
});
