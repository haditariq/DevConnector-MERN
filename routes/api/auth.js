const express = require("express")
const router = express.Router()

// @route   Get api/auth
// @desc    get all user test router
// @access  public
router.get("/", (req, res, next) => {
  res.json("Auth route.")
})


module.exports = router
