export default function userDataReducer(state, action) {
  const newState = { ...state }
  const target = action.who

  switch (action.type) {
    case 'set':
      newState[target].value = action.value
      break;

    case 'error':
      newState[target].error = action.msg
      break;

    default:
      throw Error('Invalid data provided to the reducer')
  }

  return newState
}
