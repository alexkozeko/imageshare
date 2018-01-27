import { combineReducers } from 'redux';
import posts, * as FromPosts from './posts';
import bearsReducer from '../components/DemoApp/AsyncBearsRoute/modules'
import imagesReducer from '../components/DemoApp/AsyncHomeRoute/modules'
// -----------------------------------------------------------------------------
// REDUCER

const rootReducer = combineReducers({
  posts,
  bears: bearsReducer,
  images: imagesReducer
})

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getPostById(state, id) {
  return FromPosts.getById(state.posts, id);
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default rootReducer;
