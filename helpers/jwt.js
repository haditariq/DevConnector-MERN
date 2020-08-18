const jwt = require('jsonwebtoken')

// configs
const config = require('config')
module.exports = {
  jwtSign: async (id) => {
    const payload = {
      user: {id}
    }
    return await jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 360000})
  }
}
