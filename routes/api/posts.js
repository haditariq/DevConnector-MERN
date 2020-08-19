const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../../middleware/authentication');

// Models
const User = require('../../models/User');
const Post = require('../../models/Post');
// helpers
const { validate } = require('../../helpers/validationResult');

// @route   POST api/posts
// @desc    create a post
// @access  public
router.post(
  '/',
  [
    auth,
    validate([
      body('text')
        .not()
        .isEmpty()
        .withMessage('Text is required.')
    ])
  ],
  async (req, res, next) => {
    let { text } = req.body;
    try {
      const user = await User.findById(req.user.id);
      const newPost = new Post({
        text,
        name: user.name,
        avatar: user.avatar,
        user: user.id
      });
      const post = await newPost.save();
      await res.json(post);
    } catch (e) {
      console.error(e.message ? { msg: e.message } : e);
      res.status(500).json(e.message ? { errors: [{ msg: e.message }] } : e);
    }
  }
);

// @route   Get api/posts
// @desc    create all post
// @access  Private
router.get('/', auth, async (req, res, next) => {
  try {
    const post = await Post.find().sort({ date: -1 });
    await res.json(post);
  } catch (e) {
    console.error(e.message ? { msg: e.message } : e);
    res.status(500).json(e.message ? { errors: [{ msg: e.message }] } : e);
  }
});

// @route   Get api/posts
// @desc    get a post
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).sort({ date: -1 });
    if (!post) {
      throw { errors: [{ msg: 'No, post found.' }] };
    }
    await res.json(post);
  } catch (e) {
    console.error(e.message ? { msg: e.message } : e);
    if (e.kind) {
      res.status(500).json({ errors: [{ msg: 'Server error.' }] });
    }
    res.status(500).json(e.message ? { errors: [{ msg: e.message }] } : e);
  }
});

// @route   DELETE api/posts
// @desc    delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw { errors: [{ msg: 'No, post found.' }] };
    }
    if (post.user.toString() !== req.user.id) {
      throw { errors: [{ msg: 'No, post found.' }] };
    }
    await post.remove();
    await res.json({ msg: 'Post removed.' });
  } catch (e) {
    console.error(e.message ? { msg: e.message } : e);
    if (e.kind) {
      res.status(500).json({ errors: [{ msg: 'Server error.' }] });
    }
    res.status(500).json(e.message ? { errors: [{ msg: e.message }] } : e);
  }
});

// @route   PUT api/posts/like/:id
// @desc    like a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      throw { errors: [{ msg: 'Post already liked.' }] };
    }

    post.likes.unshift({ user: req.user.id });
    const check = await post.save();
    await res.json(check);
  } catch (e) {
    console.error(e.message ? { msg: e.message } : e);
    if (e.kind) {
      res.status(500).json({ errors: [{ msg: 'Server error.' }] });
    }
    res.status(500).json(e.message ? { errors: [{ msg: e.message }] } : e);
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    unlink
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      throw { errors: [{ msg: 'Post has not yet been liked.' }] };
    }

    const removeIdx = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIdx, 1);

    const check = await post.save();
    await res.json(check);
  } catch (e) {
    console.error(e.message ? { msg: e.message } : e);
    if (e.kind) {
      res.status(500).json({ errors: [{ msg: 'Server error.' }] });
    }
    res.status(500).json(e.message ? { errors: [{ msg: e.message }] } : e);
  }
});

// @route   PUT api/post/comment/:id
// @desc    comment on post
// @access  Private
router.put(
  '/comment/:id',
  [
    auth,
    validate([
      body('text')
        .not()
        .isEmpty()
        .withMessage('text is required.')
    ])
  ],
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const post = await Post.findById(req.params.id);
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };
      post.comments.unshift(newComment);
      await post.save();
      await res.json(post.comments);
    } catch (e) {
      console.error(e.message ? { msg: e.message } : e);
      if (e.kind) {
        res.status(500).json({ errors: [{ msg: 'Server error.' }] });
      }
      res.status(500).json(e.message ? { errors: [{ msg: e.message }] } : e);
    }
  }
);

// @route   PUT api/post/comment/:id
// @desc    comment on post
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );
    if (!comment) {
      throw { errors: [{ msg: 'Comment not found.' }] };
    }

    const removeIdx = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIdx, 1);

    await post.save();
    await res.json(post.comments);
  } catch (e) {
    console.error(e.message ? { msg: e.message } : e);
    if (e.kind) {
      res.status(500).json({ errors: [{ msg: 'Server error.' }] });
    }
    res.status(500).json(e.message ? { errors: [{ msg: e.message }] } : e);
  }
});

module.exports = router;
