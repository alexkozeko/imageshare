// ------------------------------------
// Constants
// ------------------------------------

export const GET_BEARS_REQUEST = 'GET_BEARS_REQUEST'
export const GET_BEARS_SUCCESS = 'GET_BEARS_SUCCESS'
export const GET_BEARS_ERROR = 'GET_BEARS_ERROR'

export const GET_BEAR_BY_ID_REQUEST = 'GET_BEAR_BY_ID_REQUEST'
export const GET_BEAR_BY_ID_SUCCESS = 'GET_BEAR_BY_ID_SUCCESS'
export const GET_BEAR_BY_ID_ERROR = 'GET_BEAR_BY_ID_ERROR'

// ------------------------------------
// Actions
// ------------------------------------

export function getBearsAsync() {
  return function(dispatch, getState, { axios }) {
    dispatch({
      type: GET_BEARS_REQUEST
    })
    return axios
      .get(`http://localhost:1337/api/bears`)
      .then(({ data }) => {
        return dispatch({
          type: GET_BEARS_SUCCESS,
          data
        })
      })
      // We use 'react-jobs' to call our actions.  We don't want to return
      // the actual action to the 'react-jobs' withJob as it will cause
      // the data to be serialized into the react-jobs state by the server.
      // As we already have the state in the redux state tree, which is also
      // getting serialized by the server we will just return a simple "true"
      // here to indicate to react-jobs that all is well.
      .then(() => true)
  }
}

export function getBearByIdAsync(id) {
  return function(dispatch, getState, { axios }) {
    dispatch({
      type: GET_BEAR_BY_ID_REQUEST
    })
    return axios
      .get(`http://localhost:1337/api/bears/${id}`)
      .then(({ data }) => {
        return dispatch({
          type: GET_BEAR_BY_ID_SUCCESS,
          data
        })
      })
      // We use 'react-jobs' to call our actions.  We don't want to return
      // the actual action to the 'react-jobs' withJob as it will cause
      // the data to be serialized into the react-jobs state by the server.
      // As we already have the state in the redux state tree, which is also
      // getting serialized by the server we will just return a simple "true"
      // here to indicate to react-jobs that all is well.
      .then(() => true)
  }
}

export function getBearById(list, id) {
  return list.find(el => el._id === id)
}

// getBearByIdAsync, getBearById

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [GET_BEARS_SUCCESS]: (state, { data }) => {
    return {
      ...state,
      list: data
    }
  },
  [GET_BEAR_BY_ID_SUCCESS]: (state, { data }) => {
    return {
      ...state,
      list: [...state.list, data]
    }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
  list: []
}

export default function bearsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
