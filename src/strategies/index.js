const chalk = require('chalk')
const glob = require('glob')
const path = require('path')

const strategyLoad = path => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${chalk.black.bgYellowBright('Loading strategy:')} ${path}`)
  }
  return require(path)
}

const strategySort = (a, b) =>
  (a.sort || Number.MAX_VALUE) - (b.sort || Number.MAX_VALUE)

const strategies = glob
  .sync(path.join(__dirname, '*.strategy.js'))
  .map(strategyLoad)
  .sort(strategySort)

const find = async line => {
  for (const strategy of strategies) {
    if (await strategy.test(line)) {
      return strategy.exec
    }
  }

  return null
}

const exec = async line => {
  const strategy = await find(line)
  if (strategy == null) {
    throw new Error(`Error: unknown strategy for "${line}"`)
  }
  return strategy(line)
}

module.exports = {
  find,
  exec
}
