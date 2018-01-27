// //import styles from './styles.scss';

import React from 'react'
import PropTypes from 'prop-types'
import Bear from './Bear'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withJob } from 'react-jobs'
import Helmet from 'react-helmet'
import { Link, Route } from 'react-router-dom'
import { getBearsAsync } from './modules'

function mapStateToProps(state) {
  return {
    bears: state.bears.list
  }
}

const mapActionsToProps = {
  getBears: getBearsAsync,
}

// We use the "compose" function from redux (but the lodash/ramda/etc equivalent
// would do the same), so that we can neatly attach multiple higher order
// functions to our component.
// They get attached to our component from a bottom up approach (i.e. the
// arguments of compose from right to left).
// Firstly the "withJob" is attached, indicating we want to do some async work.
// Then the redux "connect" is attached.
// This means the redux state and action will be passed through our "withJob".
// The job is meant to fire the fetching of a post.  If no post exists within
// the redux state it will fire the "fetchPost" redux-thunk action.  If you
// look at that action you will see it returns a Promise. It is a requirement
// to return a Promise when executing an asynchronous job so that the job
// runner knows when the job is complete.  You will also see that we first
// check to see if the post already exists within the state, if so we just
// return it which would then result in a synchronous execution of our component.

function Bears(props) {
  console.log(props)
  return (
    <div>
      <Helmet>
        <title>Bears</title>
      </Helmet>
      <div>
        <ul>
          {
            props.bears.map( bear => {
              return <li key={bear._id}>
                <Link to={'/bears/' + bear._id}>{bear.name}</Link>
              </li>
            })
          }
        </ul>
      </div>
      <Route path="/bears/:id" component={Bear} />
    </div>
  )
}

export default compose(
  connect(mapStateToProps, mapActionsToProps),
  withJob({
    work: ({ bears, getBears, match }) => {
      if (bears.length) {
        // We already have a post, just return true.
        return true
      }
      if (match.params.id) {
        return true
      }
      console.log(match.params.id);
      // Execute the redux-thunk powered action that returns a Promise and
      // fetches the post.
      return getBears()
    }
  }),
)(Bears)

Bears.propTypes = {
}

Bears.defaultProps = {
  bears: [],
}
