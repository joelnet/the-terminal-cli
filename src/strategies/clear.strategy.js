const { getCommand } = require('../lib/command')

const test = line => getCommand(line) === 'clear'
const exec = () => process.stdout.write('\u001b[2J\u001b[0;0H')

module.exports = {
  test,
  exec,
  sort: 100
}
