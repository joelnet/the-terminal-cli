const axios = require('axios')
const config = require('../../config/default.json')
const { getState } = require('../store')
const { processResponse } = require('../processResponse')

const url = config.api.url

const test = () => true

const exec = line =>
  axios
    .post(`${url}/exec`, { line, id: getState().state.id })
    .then(res => res.data)
    .then(processResponse)

module.exports = {
  test,
  exec,
  sort: 10000
}
