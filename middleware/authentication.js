const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-header');
  if (!token) {
    return res.status(401).json({msg: 'No token, authorization denied.'})
  }
  try {
    const decode = jwt.verify(token, config.get('jwtSecret'));
    req.user = decode.user;
    next();
  } catch (e) {
    return res.status(401).json({msg: 'Token is not valid.'})
  }
}
