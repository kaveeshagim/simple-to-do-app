const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "simpletodoapp",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database: ", err.stack);
    return;
  }
  console.log("Connected to database");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve static files
app.use(express.static("public"));

//route for landing page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "landing.html"));
});

//route for login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

//route for register page
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

//route for main page
app.get("/main", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main.html"));
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        res.status(500).json({ message: "Database error" });
      } else if (result.length > 0) {
        db.query(
          "SELECT * FROM users WHERE username =  ? AND password = ?",
          [username, password],
          (err, result) => {
            if (err) {
              res.status(500).json({ message: "Database error" });
            } else if (result.length > 0) {
              res.status(200).json({ message: "Login successful" });
            } else {
              res.status(400).json({ message: "Invalid credentials" });
            }
          }
        );
      } else {
        res.status(400).json({ message: "You are not registered!" });
      }
    }
  );
});

app.post("/register", (res, req) => {
  const { username, password } = req.body;

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.",
    });
  }

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        res.status(500).json({ message: "Database error" });
      } else if (result.length > 0) {
        res.status(400).json({ message: "Username already exists" });
      } else {
        db.query(
          "INSERT INTO users (username, password) VALUES (?, ?)",
          [username, password],
          (err, result) => {
            if (err) {
              res.status(500).json({ message: "Database error" });
            } else {
              res.status(200).json({ message: "Registration successful" });
            }
          }
        );
      }
    }
  );
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});
