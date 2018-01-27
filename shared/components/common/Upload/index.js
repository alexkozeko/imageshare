import React from 'react'
import axios from 'axios'
import { withRouter } from 'react-router'
import {
  compose,
  lifecycle,
  branch,
  renderComponent,
  withStateHandlers,
  withHandlers,
  pure
} from 'recompose'

import Upload, { Loading } from './Upload'

export default compose(
  withRouter,
  withStateHandlers(
    ({ loading = false, file = null, imagePreviewUrl = null }) => ({
      loading,
      file,
      imagePreviewUrl
    }),
    {
      setLoading: () => isLoading => ({ loading: isLoading }),
      setImageInfo: () => ({ file, imagePreviewUrl })  => ({ file, imagePreviewUrl }),
      clearUploadState: () => () => ({ loading: false, file: null, imagePreviewUrl: null })
    }
  ),
  withHandlers({
    toImagePage: props => ({ _id }) => {
      props.history.push(`/images/${_id}`)
    }
  }),
  withHandlers({
    handleImageSubmit: props => () => {
      props.setLoading(true)

      let formData = new FormData()
      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      }

      formData.append('userImage', props.file)
      formData.append('hehe', 'hehetest')
      return axios.post('/api/images', formData, config)
      .then(res => {
        console.log(res)
        props.clearUploadState()
        props.toImagePage(res.data.image)
      })
    }
  }),
  withHandlers({
    handleImageChange: props => e => {
      e.preventDefault()

      let reader = new FileReader()
      let file = e.target.files[0]

      reader.onloadend = () => {
        props.setImageInfo({
          file,
          imagePreviewUrl: reader.result
        })
        console.log(reader, e, props)
        props.handleImageSubmit()
      }

      reader.readAsDataURL(file)
    }
  }),
  branch(props => props.loading, renderComponent(Loading)),
  pure
)(Upload)
