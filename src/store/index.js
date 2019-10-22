const { createStore } = require('pico-redux')

const init = {
  prompt: '$ ',
  state: {}
}

const SET_PROMPT = 'SET_PROMPT'
const SET_STATE = 'SET_STATE'

const setPrompt = store => value => store.dispatch({ type: SET_PROMPT, value })
const setState = store => value => store.dispatch({ type: SET_STATE, value })

const reducer = (prevState, { type, value }) =>
  type === SET_PROMPT
    ? { ...prevState, prompt: value }
  : type === SET_STATE
    ? { ...prevState, state: { ...prevState.state, ...value } }
  : prevState // prettier-ignore

const store = createStore(reducer, init)

module.exports = {
  setPrompt: setPrompt(store),
  setState: setState(store),
  store,
  getState: store.getState.bind(store)
}
