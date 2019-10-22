const { promisify } = require('util')

const sleep = promisify(setTimeout)

module.exports = {
  sleep
}
