const readline = require('readline')
const { store } = require('../store')

// when connecting to a new computer, the history is pushed into
// the history stack and a new history for the new computer is begun.
// on exit, the historyStack is popped and the previous history restored.
const historyStack = []

const rl = readline.createInterface({
  prompt: store.getState().prompt,
  input: process.stdin,
  output: process.stdout
})

const promptOnce = ({ prompt, mask } = {}) => {
  const originalOutput = rl.output
  const originalPrompt = rl._prompt

  if (prompt != null) {
    process.stdout.write(prompt)
    rl.setPrompt(prompt)
  }

  if (mask != null) {
    rl.output = {
      write: x => x.charCodeAt(0) === 13 && process.stdout.write(x)
    }
  }

  return new Promise(resolve => {
    rl.once('line', value => {
      if (prompt != null) {
        rl.setPrompt(originalPrompt)
      }
      if (mask != null) {
        rl.output = originalOutput
      }
      resolve(value)
    })
  })
}

const trim = (line = '') => line.trim()

const clearHistory = () => {
  rl.history.length = 0
}

const popHistory = () => {
  rl.history.pop()
}

const historyStackPush = history => {
  historyStack.push(rl.history)
  rl.history = history
}

const historyStackPop = () => {
  rl.history = historyStack.pop()
}

module.exports = {
  promptOnce,
  trim,
  clearHistory,
  popHistory,
  historyStackPush,
  historyStackPop,
  setPrompt: rl.setPrompt.bind(rl)
}
