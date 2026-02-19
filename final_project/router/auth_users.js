const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// Registered users array
let users = [];

// Check if username already exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Authenticate username & password
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Login 
regd_users.post("/login", (req, res) => {
  console.log("Login route hit! URL:", req.originalUrl);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Sign JWT token
  const accessToken = jwt.sign(
    { username: username },
    "fingerprint_customer",
    { expiresIn: 60 * 60 } // 1 hour
  );

  // Store in session
  req.session.authorization = { accessToken };

  return res.status(200).json({ message: "User successfully logged in", accessToken });
});

//Add/Modify Book Review 
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn.trim();
  const reviewText = req.query.review;

  if (!req.session.authorization) {
    return res.status(403).json({ message: "User not logged in" });
  }

  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Initialize reviews object if empty
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or update review
  books[isbn].reviews[username] = reviewText;

  return res.status(200).json({
    message: "Review successfully posted/updated",
    reviews: books[isbn].reviews
  });
});

//Task 9: Delete Book Review 
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn.trim();

  if (!req.session.authorization) {
    return res.status(403).json({ message: "User not logged in" });
  }

  const username = req.user.username;

  if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  // Delete only the logged-in user's review
  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review successfully deleted",
    reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
