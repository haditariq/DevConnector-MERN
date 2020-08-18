const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authentication');
const { check, validationResult } = require('express-validator');
// Models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   Get api/profile/me
// @desc    get current user profile
// @access  public
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      throw { errors: [{ msg: 'There is not profile for this user.' }] };
    }
    res.json(profile);
  } catch (e) {
    console.error(e.message);
    res.status(500).json(e.message ? { errors: [{ msg: e.message }] } : e);
  }
});

// @route   POST api/profile
// @desc    create or update profile route
// @access  private
router.post(
  '/',
  [
    auth,
    check('status', 'Status is required.')
      .not()
      .isEmpty(),
    check('skills', 'Skills is required.')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const {
      company,
      website,
      location,
      bio,
      status,
      githubUsername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;
    if (!errors.isEmpty()) {
      res.status(500).json(errors);
    }
    const profileFields = {};
    // Build profile fields
    profileFields.user = req.user.id;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (youtube) profileFields.youtube = youtube;
    if (twitter) profileFields.twitter = twitter;
    if (location) profileFields.location = location;
    if (facebook) profileFields.facebook = facebook;
    if (linkedin) profileFields.linkedin = linkedin;
    if (instagram) profileFields.instagram = instagram;
    if (githubUsername) profileFields.githubUsername = githubUsername;
    if (skills)
      profileFields.skills = skills.split(',').map(item => item.trim());

    // Build Social Object
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // update profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return await res.json(profile);
      }
      // create profile
      profile = new Profile(profileFields);
      await profile.save();
      await res.json(profile);
    } catch (e) {
      console.error(e.message ? { msg: e.message } : e);
      res.status(500).json(e.message ? { errors: [{ msg: e.message }] } : e);
    }
  }
);

// @route   GET api/profile
// @desc    get all profiles
// @access  public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find({}).populate('user', [
      'name',
      'avatar'
    ]);
    await res.json(profiles);
  } catch (e) {
    console.error(e.message ? { msg: e.message } : e);
    res.status(500).json(e.message ? { errors: [{ msg: e.message }] } : e);
  }
});

// @route   GET api/profile/user/:user_id
// @desc    get user profile by user_id
// @access  public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      throw { errors: [{ msg: 'Profile not found.' }] };
    }
    await res.json(profile);
  } catch (e) {
    if (e.kind) {
      res.status(500).json({ errors: [{ msg: 'Server error.' }] });
    }
    console.error(e.message ? { msg: e.message } : e);
    res.status(500).json(e.message ? { errors: [{ msg: e.message }] } : e);
  }
});

// @route   DELETE api/profile/user/:user_id
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    await res.json({ msg: 'User deleted.' });
  } catch (e) {
    console.error(e.message ? { msg: e.message } : e);
    res.status(500).json(e.message ? { errors: [{ msg: e.message }] } : e);
  }
});

// @route   PUT api/profile/experience
// @desc    add profile experience
// @access  Private
router.put(
  '/experience',
  [
    auth,
    check('title', 'Title is required.')
      .not()
      .isEmpty(),
    check('company', 'Company is required.')
      .not()
      .isEmpty(),
    check('from', 'From date is required.')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors) {
      return res.state(400).json({ errors });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;
    const experience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(experience);
      await profile.save();
      await res.json(profile);
    } catch (e) {
      console.error(e.message ? { msg: e.message } : e);
      res.status(500).json(e.message ? { errors: [{ msg: e.message }] } : e);
    }
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    remove profile experience
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  const { exp_id } = req.params;
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIdx = profile.experience.map(item => item.id).indexOf(exp_id);
    profile.experience.splice(removeIdx, 1);
    await profile.save();
    await res.json(profile);
  } catch (e) {
    console.error(e.message ? { msg: e.message } : e);
    res.status(500).json(e.message ? { errors: [{ msg: e.message }] } : e);
  }
});

// TODO: add education
// TODO: remove education

module.exports = router;
