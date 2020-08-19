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
    const post = await Post.findById(req.params.id).sort({ date: -1 });
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

module.exports = router;
