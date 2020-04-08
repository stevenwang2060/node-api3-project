const express = require('express');
const router = express.Router();
const Post = require('./postDb');

router.get('/', (req, res) => {
  Post.get()
  .then(posts => {
    res.status(201).json(posts);
  })
  .catch(() => {
    res.status(500).json({ message: 'There was an error fetching the posts from the database' });
  })
});

router.get('/:id', validatePostId, (req, res) => {
  Post.getById(req.params.id)
  .then(post => {
    res.status(201).json(post);
  })
  .catch(() => {
    res.status(500).json({ message: 'There was an error fetching the post from the database' });
  })
});

router.delete('/:id', validatePostId, (req, res) => {
  Post.remove(req.params.id)
  .then(() => {
    res.status(201).json({ message: 'Post succesfully deleted' });
  })
  .catch(() => {
    res.status(500).json({ message: 'There was an error deleting the post' });
  })
});

router.put('/:id', validatePostId, (req, res) => {
  Post.update(req.params.id, req.body)
  .then(() => {
    Post.getById(req.params.id)
    .then(post => {
      res.status(201).json(post);
    })
  })
  .catch(() => {
    res.status(500).json({ message: 'There was an error updating the post' });
  })
});

// custom middleware
function validatePostId(req, res, next) {
  Post.getById(req.params.id)
  .then(post => {
    if(post){
      next();
    }else{
      res.status(404).json({ message: "Post does not exist in the database" });
    }
  })
  .catch(() => {
    res.status(500).json({ message: 'There was an error fetching the post from the database' });
  })
}

module.exports = router;