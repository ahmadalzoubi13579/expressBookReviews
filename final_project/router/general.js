const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      message: 'Invalid Data!',
    });
  } else if (!isValid(username)) {
    res.status(400).json({
      message: 'User already exist!',
    });
  } else {
    users.push({
      username,
      password,
    });
    res
      .status(300)
      .json({ message: 'User has been registered successfully🎊' });
  }
});

const getAllBooks = () =>
  new Promise((resolve, reject) => {
    try {
      resolve(books);
    } catch (error) {
      reject(error);
    }
  });

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const data = await getAllBooks();
    res.status(300).json({ message: data });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json({ message: 'Internal server error!' });
  }
});

const getBookByIsbn = (isbn) =>
  new Promise((resolve, reject) => {
    try {
      const data = books[isbn];

      resolve(data);
    } catch (error) {
      reject(error);
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const data = await getBookByIsbn(Number(req.params.isbn));
    if (data) {
      res.status(300).json({ message: data });
    } else {
      res.status(404).json({
        message: 'Book not exist',
      });
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json({ message: 'Internal server error!' });
  }
});

const getBooksByAuthor = (author) =>
  new Promise((resolve, reject) => {
    try {
      const data = [];

      for (const [key, value] of Object.entries(books)) {
        const book = value;
        if (book.author === author) {
          data.push(book);
        }
      }

      resolve(data);
    } catch (error) {
      reject(error);
    }
  });

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const data = await getBooksByAuthor(req.params.author);
    res.status(300).json({ message: data });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json({ message: 'Internal server error!' });
  }
});

const getBooksByTitle = (title) =>
  new Promise((resolve, reject) => {
    try {
      const data = [];

      for (const [key, value] of Object.entries(books)) {
        const book = value;
        if (book.title === title) {
          data.push(book);
        }
      }

      resolve(data);
    } catch (error) {
      reject(error);
    }
  });

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const data = await getBooksByTitle(req.params.title);
    res.status(300).json({ message: data });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json({ message: 'Internal server error!' });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbnParam = Number(req.params.isbn);
  if (books[isbnParam]) {
    const data = books[isbnParam].reviews;
    res.status(300).json({ message: data });
  } else {
    res.status(404).json({
      message: 'Book not exist',
    });
  }
});

module.exports.general = public_users;
