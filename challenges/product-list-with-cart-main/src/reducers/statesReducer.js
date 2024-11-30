export default function statesReducer(state, action) {
  const newState = new Map(state)

  function updateToValue(appState, value) {
    newState.set(appState, value)
  }

  updateToValue(action.state, action.value)

  return newState
}
