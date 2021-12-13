import {
  ADD_CHAT_MESSAGE,
  CONNECT,
  SET_CHARACTER,
  SET_IMAGE, SET_IS_LOGGED_IN
} from '../types/rpg-types'
import {initialState} from './initialState'
import React, {createContext, useReducer} from 'react'

const context = createContext(initialState)
const {Provider} = context

const msgValid = msg => msg && typeof msg === 'object'

const reducer = (state, action) => {
  let {payload, type} = action
  switch (type) {
    case ADD_CHAT_MESSAGE:
      const {msg: chatMsg} = payload

      if (msgValid(chatMsg)) {
        chatMsg.id = state.chatMessages.length + 1
        state.chatMessages = [...state.chatMessages, chatMsg]
      }

      return {
        ...state
      }
    case CONNECT:
      const {msg} = payload
      if (msgValid(msg)) {
        const { username, password } = msg
        state.username = username
      }

      return {
        ...state
      }
    case SET_IS_LOGGED_IN:

      let { character, error } = payload
      debugger
      let isLoggedIn = character && Object.keys(character).length > 0 && !error

      if (!isLoggedIn) {
        character = null
      }

      return {
        ...state,
        character: {
          ...character
        },
        isLoggedIn
      }
    case SET_CHARACTER:
      const {msg: charMsg} = payload
      if (msgValid(charMsg)) {
        state.character = JSON.parse(charMsg.data)
      }

      return {
        ...state
      }
    case SET_IMAGE:
      const {msg: imgMsg} = payload
      if (msgValid(imgMsg)) {
        let strSource = "data:image/jpeg;base64," + imgMsg.data
        state.images = [...state.images, strSource]
      }

      return {
        ...state
      }
    default:
      return state
  }
}

const RpgProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = {state, dispatch}

  return (
    <Provider value={value}>
      {children}
    </Provider>
  )
}

export {context, RpgProvider}