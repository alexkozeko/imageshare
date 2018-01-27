// ------------------------------------
// Constants
// ------------------------------------

export const GET_IMAGES_REQUEST = 'GET_IMAGES_REQUEST'
export const GET_IMAGES_SUCCESS = 'GET_IMAGES_SUCCESS'
export const GET_IMAGES_ERROR = 'GET_IMAGES_ERROR'

export const GET_IMAGE_BY_ID_REQUEST = 'GET_IMAGE_BY_ID_REQUEST'
export const GET_IMAGE_BY_ID_SUCCESS = 'GET_IMAGE_BY_ID_SUCCESS'
export const GET_IMAGE_BY_ID_ERROR = 'GET_IMAGE_BY_ID_ERROR'

// ------------------------------------
// Actions
// ------------------------------------

export function getImagesAsync() {
  return function(dispatch, getState, { axios }) {
    dispatch({
      type: GET_IMAGES_REQUEST
    })
    return axios
      .get(`http://localhost:1337/api/images`)
      .then(({ data }) => {
        return dispatch({
          type: GET_IMAGES_SUCCESS,
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

export function getImageByIdAsync(id) {
  return function(dispatch, getState, { axios }) {
    dispatch({
      type: GET_IMAGE_BY_ID_REQUEST
    })
    return axios
      .get(`http://localhost:1337/api/images/${id}`)
      .then(({ data }) => {
        return dispatch({
          type: GET_IMAGE_BY_ID_SUCCESS,
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

export function getImageById(list, id) {
  return list.find(el => el._id === id)
}

// getImageByIdAsync, getImageById

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [GET_IMAGES_SUCCESS]: (state, { data }) => {
    return {
      ...state,
      list: data
    }
  },
  [GET_IMAGE_BY_ID_SUCCESS]: (state, { data }) => {
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

export default function imagesReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
