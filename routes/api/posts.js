const express = require("express")
const router = express.Router()

// @route   Get api/posts
// @desc    get all user test router
// @access  public
router.get("/", (req, res, next) => {
  next()
  res.json("posts route.")
})


module.exports = router
