const axios = require('axios')
const chalk = require('chalk')
const { promptOnce, trim } = require('./lib/prompt')
const { exec } = require('./strategies')
const config = require('../config/default.json')
const { store } = require('./store')
const { processResponse } = require('./processResponse')

const login = async () => {
  const response = await axios
    .get(`${config.api.url}/login`)
    .then(response => response.data)
  await processResponse(response)
}

const main = async () => {
  process.stdout.write(store.getState().prompt)
  const line = trim(await promptOnce())
  await exec(line)
  return main()
}

login()
  .then(() => main())
  .catch(err => {
    console.error(chalk.red(`Fatal Error: ${err.stack || err}`))
    process.exit(0)
  })
