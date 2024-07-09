const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' },
    //...
  ];

const isValid = (username) => {
    return users.some((user) => user.username === username);
  };
  
  const authenticatedUser = (username, password) => {
    return users.some((user) => user.username === username && user.password === password);
  };
  
  regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  
    req.session.username = username;
  
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60 * 60 });
    // Store access token in session
    req.session.authorization = {
      accessToken
    }
    return res.status(200).json({ accessToken, message: "User successfully logged in" });
  });

// Add a book review
regd_users.post("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reviewText = req.query.review;
    const username = req.session.username; // Assuming username is stored in session

    if (!username) {
        return res.status(401).send('User not logged in');
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).send('Book not found');
    }

    // Add or modify the review
    books[isbn].reviews[username] = reviewText;

    res.send('Review added/modified successfully');
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username; // Assuming username is stored in session

    if (!username) {
        return res.status(401).send('User not logged in');
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).send('Book not found');
    }

    // Check if the review by the user exists
    if (!books[isbn].reviews[username]) {
        return res.status(404).send('Review not found or you do not have permission to delete this review');
    }

    // Delete the review
    delete books[isbn].reviews[username];

    res.send('Review deleted successfully');
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
