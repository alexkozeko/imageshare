
import React from 'react'
// import PropTypes from 'prop-types'
import Bear from './Bear'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withJob } from 'react-jobs'
import Helmet from 'react-helmet'
import { getBearByIdAsync, getBearById } from './modules'

function mapStateToProps(state, { match }) {
  return {
    bear: getBearById(state.bears.list, match.params.id)
  }
}

const mapActionsToProps = {
  getBearById: getBearByIdAsync
}

function BearView(props) {
  return (
    <div>
      <Helmet title={`Bears - ${props.name}`} />
      <h1>Name: {props.bear.name}</h1>
      <h2>id: {props.bear._id}</h2>
    </div>
  )
}

export default compose(
  connect(mapStateToProps, mapActionsToProps),
  withJob({
    work: ({ bear, getBearByIdAsync, match }) => {
      if (bear) {
        // We already have a post, just return true.
        return true
      }

      // Execute the redux-thunk powered action that returns a Promise and
      // fetches the post.
      return getBearByIdAsync(match.params.id)
    },
    // Any time the post id changes we need to trigger the work.
    shouldWorkAgain: (prevProps, nextProps) =>
      prevProps.match.params.id !== nextProps.match.params.id,
  }),
)(BearView)
