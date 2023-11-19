const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return !users.find((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return Boolean(
    users.find(
      (user) => user.username === username && user.password === password
    )
  );
};

const createToken = (user) => {
  const accessToken = jwt.sign(
    {
      username: user.username,
      password: user.password,
      time: new Date(),
    },
    'access',
    {
      expiresIn: 60 * 60,
    }
  );

  return accessToken;
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      message: 'Invalid Data!',
    });
  } else if (!authenticatedUser(username, password)) {
    res.status(400).json({
      message: 'User not registered!',
    });
  } else {
    const accessToken = createToken({
      username,
      password,
    });

    req.session.auth = {
      accessToken,
    };
    res.status(300).json({ message: 'User has been logged in successfully🎊' });
  }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const username = req.user.username;
  const isbnParam = Number(req.params.isbn);
  const review = req.body.review;

  if (books[isbnParam]) {
    books[isbnParam].reviews[username] = review;
    res
      .status(300)
      .json({ message: 'User review has been added successfully' });
  } else {
    res.status(404).json({
      message: 'Book not exist',
    });
  }
});

// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const username = req.user.username;
  const isbnParam = Number(req.params.isbn);

  if (books[isbnParam]) {
    delete books[isbnParam].reviews[username];
    res
      .status(300)
      .json({ message: 'User review has been deleted successfully' });
  } else {
    res.status(404).json({
      message: 'Book not exist',
    });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
