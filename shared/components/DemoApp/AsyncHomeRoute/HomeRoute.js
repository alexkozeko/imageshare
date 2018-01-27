import React from 'react'
import Helmet from 'react-helmet'
import axios from 'axios'

import config from '../../../../config'
import {
  Button,
  Paper,
  Grid
} from 'material-ui'

import { withStyles } from 'material-ui/styles';
import { GridList, GridListTile, GridListTileBar } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';

import { compose } from 'redux'
import { connect } from 'react-redux'
import { withJob } from 'react-jobs'
import { Link, Route } from 'react-router-dom'
import { getImagesAsync } from './modules'

import Upload from '../../common/Upload'

function mapStateToProps(state) {
  return {
    images: state.images.list
  }
}

const mapActionsToProps = {
  getImages: getImagesAsync,
}

const ImagesGridList = props => (
  <div className={props.classes.root}>
    <GridList cols={3} cellHeight={160} className={props.classes.gridList}>
      {props.images.map(tile => (
        <GridListTile key={tile._id} cols={1}>
          <img src={tile.imagePath} alt={tile.imageName} />
          <GridListTileBar
            title={tile.imageName}
            titlePosition="top"
            actionIcon={
              <IconButton>
                x
              </IconButton>
            }
            actionPosition="left"
            className={props.classes.titleBar}
          />
        </GridListTile>
      ))}
    </GridList>
  </div>
)

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
});

const StyledImagesGridList = withStyles(styles)(ImagesGridList)

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      imagePreviewUrl: ''
    }
    this._handleImageChange = this._handleImageChange.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  _handleSubmit(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
    let formData = new FormData()
    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    }
    formData.append('userImage', this.state.file)
    formData.append('hehe', 'hehetest')
    return axios.post('/api/images', formData, config)
    .then(() => {
      this.setState({})
    })
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  render() {
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    }

    return (
      <div>
        <form onSubmit={this._handleSubmit}>
          <Button raised component='label'>
            {'Upload'}
            <input
              onChange={this._handleImageChange}
              style={{ display: 'none' }}
              type='file'
            />
          </Button>
          <Button type='submit' raised onClick={this._handleSubmit}>Upload Image</Button>
        </form>
        {$imagePreview}
      </div>
    )
  }

}


function HomeRoute(props) {
  return (
    <div>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <h2>{config('welcomeMessage')}</h2>
      <Upload/>
      <Grid container spacing={24}>
        <Grid item xs={12} sm={4}>
          <StyledImagesGridList images={props.images} />
        </Grid>
      </Grid>

    </div>
  )
}

export default compose(
  connect(mapStateToProps, mapActionsToProps),
  withJob({
    work: ({ images, getImages, match }) => {
      if (images.length) {
        // We already have a post, just return true.
        return true
      }
      if (match.params.id) {
        return true
      }
      console.log(match.params.id)
      // Execute the redux-thunk powered action that returns a Promise and
      // fetches the post.
      return getImages()
    }
  })
)(HomeRoute)
