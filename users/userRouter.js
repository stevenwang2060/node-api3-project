const express = require('express');
const router = express.Router();
const User = require('./userDb');
const Post = require('../posts/postDb');

router.post('/', validateUser, (req, res) => {
  console.log(req.body);
  User.insert(req.body)
  .then(newUser => {
    res.status(201).json(newUser);
  })
  .catch(() => {
    res.status(500).json({  message: 'There was an error adding the user to the database' });
  })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  Post.insert({
    ...req.body,
    user_id: req.params.id
  })
  .then(newPost => {
    res.status(201).json(newPost);
  })
  .catch(() => {
    res.status(500).json({ message: 'There was an error adding a post to the database' });
  })
});

router.get('/', (req, res) => {
  User.get()
  .then(users => {
    res.status(201).json(users);
  })
  .catch(() =>{
    res.status(500).json({ message: 'There was an error fetching users from database' });
  })
});

router.get('/:id', validateUserId, (req, res) => {
  User.getById(req.params.id)
  .then(user => {
    res.status(201).json(user);
  })
  .catch(() => {
    res.status(500).json({ message: 'There was an error fetching the user from the database' });
  })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  User.getUserPosts(req.params.id)
  .then(posts => {
    res.status(201).json(posts);
  })
  .catch(() => {
    res.status(404).json({ message: 'There was an error fetching the user posts from the database' });
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  User.remove(req.params.id)
  .then(() => {
    res.status(201).json({ message: 'The user was succesully removed from the database' });
  })
  .catch(() => {
    res.status(500).json({ message:'There was an error removing the user from the database' });
  })
});

router.put('/:id', validateUserId, (req, res) => {
  User.update(req.params.id, req.body)
  .then(() => {
    User.getById(req.params.id)
    .then(user => {
      res.status(201).json(user);
    })
  })
  .catch(() => {
    res.status(500).json({ message:'There was an error updating the user' });
  })
});

//custom middleware
function validateUserId(req, res, next) {
  User.getById(req.params.id)
  .then(user => {
    if(user){
      next();
    }else{
      res.status(404).json({ message: "User does not exist in the database" });
    }
  })
  .catch(() => {
    res.status(500).json({ message: 'There was an error fetching the user from the database' });
  })
}

function validateUser(req, res, next) {
  if(!req.body){
    res.status(400).json({ message: "missing user data" });
  }
  if(!req.body.name){
    res.status(400).json({ message: "missing required name field" });
  }
  next();
}

function validatePost(req, res, next) {
  if(!req.body){
    res.status(400).json({ message: "missing post data" });
  }
  if(!req.body.text){
    res.status(400).json({ message: "missing required text field" });
  }
  next();
}

module.exports = router;