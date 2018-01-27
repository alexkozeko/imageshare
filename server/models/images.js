// load the things we need
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const imagesSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  imageName: {
    type: String
  },
  description: {
    type: String
  },
  imagePath: {
    type: String,
    required: 'Path is required'
  }
  // },
  // user: {
  //   type: Schema.ObjectId,
  //   ref: 'User'
  // }
})

module.exports = mongoose.model('Images', imagesSchema);