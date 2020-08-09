const express = require("express")
const router = express.Router()

// @route   Get api/profile
// @desc    get all user test router
// @access  public
router.get("/", (req, res, next) => {
  res.json("Profile route.")
})


module.exports = router
