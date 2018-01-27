// load the things we need
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var BearSchema = new Schema({
  name: {
    type: String,
    default: 'Unknown Bear',
    required: 'Title cannot be blank'
  },
  image: {
    type: String,
    required: 'Image is required'
  }
})

module.exports = mongoose.model('Bear', BearSchema)