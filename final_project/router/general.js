const express = require('express');
const axios = require('axios'); // for async calls if needed
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

/**
 * Task 6: Register New User
 */
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and Password required" });
    }

    if (isValid(username)) {
        return res.status(404).json({ message: "User already exists!" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
});


/**
 * Task 10: Get All Books (Async/Await)
 */
public_users.get("/", async (req, res) => {
    try {
        // Simulate async fetch, can replace with axios call if needed
        const allBooks = await Promise.resolve(books);
        res.status(200).json(allBooks);
    } catch (err) {
        res.status(500).json({ message: "Error fetching books", error: err.message });
    }
});


/**
 * Task 11: Get Book by ISBN (Async/Await)
 */
public_users.get("/isbn/:isbn", async (req, res) => {
    const isbn = req.params.isbn.trim();
    try {
        const book = await Promise.resolve(books[isbn]);
        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error fetching book by ISBN", error: err.message });
    }
});


/**
 * Task 12: Get Books by Author (Async/Await)
 */
public_users.get("/author/:author", async (req, res) => {
    const author = req.params.author.trim().toLowerCase();
    try {
        const allBooks = await Promise.resolve(books);
        const filteredBooks = Object.values(allBooks).filter(book => book.author.toLowerCase() === author);

        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res.status(404).json({ message: "No books found for this author" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error fetching books by author", error: err.message });
    }
});


/**
 * Task 13: Get Books by Title (Async/Await)
 */
public_users.get("/title/:title", async (req, res) => {
    const title = req.params.title.trim().toLowerCase();
    try {
        const allBooks = await Promise.resolve(books);
        const filteredBooks = Object.values(allBooks).filter(book => book.title.toLowerCase() === title);

        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res.status(404).json({ message: "No books found with this title" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error fetching books by title", error: err.message });
    }
});


/**
 * Task 5: Get Book Reviews
 */
public_users.get("/review/:isbn", async (req, res) => {
    const isbn = req.params.isbn.trim();
    try {
        const book = await Promise.resolve(books[isbn]);
        if (book) {
            return res.status(200).json(book.reviews);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error fetching book reviews", error: err.message });
    }
});


module.exports.general = public_users;
