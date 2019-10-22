const { parse } = require('shell-quote')

const getCommand = line => parse(line)[0]
const getArgs = line => parse(line).slice(1)

module.exports = {
  parse,
  getCommand,
  getArgs
}
