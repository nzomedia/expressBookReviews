const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username, password} = req.body;

  if(!username)
    return res.status(400).json(JSON.stringify({error: "Missing username."}));
  if(!password)
    return res.status(400).json(JSON.stringify({error: "Missing password."}));

  if(isValid(username))
    return res.status(400).json(JSON.stringify({error: `Username ${username} is already in use.`}));

  users.push({username, password});
  return res.status(201).json({message: 'New user registered.'});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = Number.parseInt(req.params.isbn);

    if(!isbn)
      return res.status(400).json(JSON.stringify({error: "Missing ISBN parameter."}));
    if(!isbn in books)
      return res.status(404).json(JSON.stringify({error: `There's no book with ISBN "${isbn}"`}));
    
    const book = books[isbn];
    return res.send(JSON.stringify(book, null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  if(!author)
    return res.status(400).json(JSON.stringify({error: "Missing author parameter."}));

  const book = Object.values(books).find(b => b.author == author);

  if(!book)
    return res.status(404).json(JSON.stringify({error: `There's no book with author "${author}"`}));
  
  return res.send(JSON.stringify(book, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  if(!title)
    return res.status(400).json(JSON.stringify({error: "Missing title parameter."}));

  const book = Object.values(books).find(b => b.title == title);

  if(!book)
    return res.status(404).json(JSON.stringify({error: `There's no book with title "${title}"`}));
  
  return res.send(JSON.stringify(book, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = Number.parseInt(req.params.isbn);

  if(!isbn)
    return res.status(400).json(JSON.stringify({error: "Missing ISBN parameter."}));

  if(!isbn in books)
    return res.status(404).json(JSON.stringify({error: `There's no book with ISBN "${isbn}"`}));
  
  const book = books[isbn];

  return res.send(JSON.stringify(book.reviews, null, 4));
});

module.exports.general = public_users;
