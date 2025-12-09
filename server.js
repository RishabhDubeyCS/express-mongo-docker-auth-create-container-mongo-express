const express = require("express");
const app = express();
const path = require("path");
const { MongoClient } = require("mongodb");

const PORT = 3030;

// Parse form data (from HTML form)
app.use(express.urlencoded({ extended: true }));

// Serve signup page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});
/*
  MONGO_URL:
  - If Express is running in DOCKER with Mongo container named "mongodb":
      mongodb://mongodb:27017
  - If Express is running on your local machine and MongoDB is also local:
      mongodb://localhost:27017
*/

// 👉 choose ONE of these depending on your setup:

// For Docker containers (same network, mongo container name = mongodb)
const MONGO_URL = "mongodb://delta_admin:delta_pass@localhost:27017";



// If you are running locally (WITHOUT Docker for backend), use this instead:
// const MONGO_URL = "mongodb://localhost:27017";

const client = new MongoClient(MONGO_URL);

// 🔁 GET all users
app.get("/getUsers", async (req, res) => {
  try {
    await client.connect();
    console.log("✅ Connected successfully to server");



    const db = client.db("my-sample-db");
    const data = await db.collection("users").find({}).toArray();

    res.send(data);
  } catch (err) {
    console.error("Error in /getUsers:", err);
    res.status(500).send("Server error");
  } finally {
    await client.close();
  }
});

// 🆕 POST new user (signup)
app.post("/addUser", async (req, res) => {
  const newUser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password, // (for real apps, hash this)
  };
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});
  try {
    await client.connect();
    console.log("✅ Connected successfully to server");

    const db = client.db("my-sample-db");

    // optional: check if email already exists
    const existing = await db.collection("users").findOne({ email: newUser.email });
    if (existing) {
      return res.status(409).send("User with this email already exists");
    }

    await db.collection("users").insertOne(newUser);

    // redirect back to form or send message
    res.send("User registered successfully!");
  } catch (err) {
    console.error("Error in /addUser:", err);
    res.status(500).send("Server error");
  } finally {
    await client.close();
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});



