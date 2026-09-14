const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const dbPath = path.join(__dirname, 'database', 'posts.json');

// Read posts from JSON file
const readPosts = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data).posts;
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
};

// Write posts to JSON file
const writePosts = (posts) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify({ posts }, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing posts:', error);
    return false;
  }
};

// GET all posts
app.get('/api/posts', (req, res) => {
  const posts = readPosts();
  res.json(posts);
});

// GET single post by ID
app.get('/api/posts/:id', (req, res) => {
  const posts = readPosts();
  const post = posts.find(p => p.id === parseInt(req.params.id) || p.id === req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

// CREATE new post
app.post('/api/posts', (req, res) => {
  const newPost = req.body;
  const posts = readPosts();
  posts.push(newPost);
  
  if (writePosts(posts)) {
    res.status(201).json(newPost);
  } else {
    res.status(500).json({ error: 'Failed to save post' });
  }
});

// UPDATE post
app.put('/api/posts/:id', (req, res) => {
  const posts = readPosts();
  const index = posts.findIndex(p => p.id === parseInt(req.params.id) || p.id === req.params.id);
  
  if (index !== -1) {
    posts[index] = { ...posts[index], ...req.body };
    if (writePosts(posts)) {
      res.json(posts[index]);
    } else {
      res.status(500).json({ error: 'Failed to update post' });
    }
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

// DELETE post
app.delete('/api/posts/:id', (req, res) => {
  const posts = readPosts();
  const index = posts.findIndex(p => p.id === parseInt(req.params.id) || p.id === req.params.id);
  
  if (index !== -1) {
    const deletedPost = posts.splice(index, 1);
    if (writePosts(posts)) {
      res.json(deletedPost[0]);
    } else {
      res.status(500).json({ error: 'Failed to delete post' });
    }
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
