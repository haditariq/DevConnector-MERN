const express = require("express")
const router = express.Router()

// @route   Get api/users
// @desc    get all user test router
// @access  public
router.get("/", (req, res, next) => {
  res.json("User route.")
})


module.exports = router
