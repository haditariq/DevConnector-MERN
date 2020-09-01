const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// helpers
const { jwtSign } = require('../../helpers/jwt');

// Models
const User = require('../../models/User');

// @route   POST api/users
// @desc    get all user test router
// @access  public
router.post(
  '/',
  [
    check('name', 'isReq')
      .not()
      .isEmpty()
      .trim(),
    check('email', 'Valid email required')
      .isEmail()
      .trim(),
    check(
      'password',
      'Password length should be greater then than 6.'
    ).isLength({ min: 6 })
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) throw { errors: [{ msg: 'User already exists.' }] };

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      user = new User({
        name,
        email,
        password,
        avatar
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      user = await user.save();
      let token = await jwtSign(user.id);
      await res.json({ token, user });
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

module.exports = router;
