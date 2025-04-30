const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const { JWT_SECRET } = require('../config/credentials.js');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return !!users.find(u => u.username == username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let user = users.find(u => u.username == username && u.password === password);
  return !!user;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;

  if(!username)
    return res.status(400).json(JSON.stringify({error: "Missing username."}));
  if(!password)
    return res.status(400).json(JSON.stringify({error: "Missing password."}));

  if(!isValid(username))
    return res.status(401).json(JSON.stringify({error: `Username or password not valid.`}));

  if(!authenticatedUser(username, password))
    return res.status(401).json(JSON.stringify({error: `Username or password not valid.`}));

  req.session.auth = jwt.sign({
    username
  }, JWT_SECRET);
  
  return res.send(JSON.stringify({message: 'Authenticated successfully.'}, null, 4));
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = Number.parseInt(req.params.isbn);

  const {username} = jwt.verify(req.session.auth, JWT_SECRET)
  if(!username)
    return res.status(401).json({error: 'Not logged in, please login again and retry.'});

  if(!isbn)
    return res.status(400).json(JSON.stringify({error: "Missing ISBN parameter."}));
  if(!isbn in books)
    return res.status(404).json(JSON.stringify({error: `There's no book with ISBN "${isbn}"`}));
  
  const book = books[isbn];
  const review = req.query.review;
  book.reviews[username] = review;
  return res.status(201).json({message: 'New review added.'}); 
});


regd_users.delete("/auth/review/:isbn", (req,res) => {
  const isbn = Number.parseInt(req.params.isbn);

  const {username} = jwt.verify(req.session.auth, JWT_SECRET)
  if(!username)
    return res.status(401).json({error: 'Not logged in, please login again and retry.'});

  if(!isbn)
    return res.status(400).json(JSON.stringify({error: "Missing ISBN parameter."}));
  if(!isbn in books)
    return res.status(404).json(JSON.stringify({error: `There's no book with ISBN "${isbn}"`}));
  
  const book = books[isbn];
  if(username in book.reviews)
    delete book.reviews[username];
  return res.status(201).json({message: 'Book review deleted.'}); 
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
