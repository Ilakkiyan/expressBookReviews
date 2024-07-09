const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post('/register', function (req, res) {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    if (users[username]) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Register the new user
    users[username] = { password };
    res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //res.send(JSON.stringify({books}, null, 4));
  let firstPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
    resolve(JSON.stringify({books}, null, 4))
    },3000)})
    firstPromise.then((successMessage) => {
        console.log("From Callback " + successMessage)
    })
    
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //const isbn = req.params.isbn;
  let filtered_books = books.filter((books) => books.isbn == req.params.isbn);
  //res.send(filtered_books);
  let firstPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
    resolve(filtered_books)
    },3000)})
    firstPromise.then((successMessage) => {
        console.log("From Callback " + successMessage)
    })
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    // Assuming you have a books object where ISBNs are keys and values are book details
    const booksByAuthor = [];

    // Iterate through the books object to find books by the specified author
    for (let isbn in books) {
        if (books[isbn].author === author) {
            booksByAuthor.push(books[isbn]);
        }
    }
    let firstPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
        resolve(booksByAuthor)
        },3000)})
        
    if (booksByAuthor.length > 0) {
        firstPromise.then((successMessage) => {
            console.log(successMessage)
        })
    } else {
        return res.status(404).json({ error: "No books found by this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    
    // Assuming you have a books object where ISBNs are keys and values are book details
    const booksByTitle = [];

    // Iterate through the books object to find books with the specified title
    for (let isbn in books) {
        if (books[isbn].title === title) {
            booksByTitle.push(books[isbn]);
        }
    }
    

    if (booksByTitle.length > 0) {
        firstPromise.then((successMessage) => {
            console.log(successMessage)
        })
    } else {
        return res.status(404).json({ error: "No books found with this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    let firstPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
        resolve(book.reviews)
        },3000)})

    if (book) {
        firstPromise.then((successMessage) => {
            console.log(successMessage)
        })

    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
