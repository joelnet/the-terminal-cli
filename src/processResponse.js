const axios = require('axios')
const config = require('../config/default.json')
const {
  clearHistory,
  popHistory,
  promptOnce,
  setPrompt,
  historyStackPush,
  historyStackPop
} = require('./lib/prompt')
const { setPrompt: storeSetPrompt, setState, store } = require('./store')
const { sleep } = require('./lib/sleep')

const processResponse = async ([head, ...tail]) => {
  if (head == null) {
    return
  } else if (head.type === 'SET_PROMPT') {
    storeSetPrompt(head.value)
    setPrompt(head.value)
  } else if (head.type === 'SET_STATE') {
    setState(head.value)
  } else if (head.type === 'ECHO') {
    const end = head.crlf === false || head.value == '' ? '' : '\r\n'
    await sleep(head.delay || 5)
    process.stdout.write(head.value + end)
  } else if (head.type === 'EXIT') {
    process.exit()
  } else if (head.type === 'CLEAR_HISTORY') {
    clearHistory()
  } else if (head.type === 'HISTORY_STACK_PUSH') {
    historyStackPush(head.value)
  } else if (head.type === 'HISTORY_STACK_POP') {
    historyStackPop()
  } else if (head.type === 'PROMPT') {
    const line = await promptOnce({
      prompt: head.value.prompt,
      mask: head.value.type === 'password' ? '*' : undefined
    })

    if (head.value.history === false) {
      popHistory()
    }

    if (head.value.key) {
      const data = {
        id: store.getState().state.id,
        ...(head.value.line && { line: head.value.line }),
        ...(head.value.state && { state: head.value.state }),
        [head.value.key]: line
      }

      await axios
        .post(`${config.api.url}/${head.value.action}`, data)
        .then(response => response.data)
        .then(processResponse)
    }
  }

  if (tail.length > 0) {
    return processResponse(tail)
  }
}

module.exports = {
  processResponse
}
