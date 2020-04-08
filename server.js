const express = require('express');
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');

const server = express();
server.use(logger);
server.use(express.json());
server.use('/posts', postRouter);
server.use('/users', userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} Request to: ${req.originalUrl} at ${Date.now()}`);
  next();
}

module.exports = server;