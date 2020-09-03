const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

//models
const User = require('../../models/User');

// middleware
const auth = require('../../middleware/authentication');

// helpers
const {jwtSign} = require('../../helpers/jwt');

// @route   Post api/auth
// @desc    get user auth
// @access  public
router.get('/', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    res.status(200).json({user})
  } catch (e) {
    console.log(e.message)
    res.status(500).json('Server Error')
  }
});


// @route   POST api/auth/login
// @desc    authenticate user & get token
// @access  public
router.post(
  '/login',
  [
    check('email', 'Valid email required').isEmail().trim(),
    check(
      'password',
      'Password is required.'
    ).exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors)
    }

    const {email, password} = req.body;
    try {
      let user = await User.findOne({email}).select('+password');
      if (!user) throw {errors: [{msg: 'Invalid credentials.'}]};
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw {errors: [{msg: 'Invalid credentials.'}]}
      }
      let token = await jwtSign(user.id);
      await res.json({token});
    } catch (e) {
      console.log(e);
      res.status(500).json(e.message ? e.message : e);
    }
  }
);

module.exports = router;
