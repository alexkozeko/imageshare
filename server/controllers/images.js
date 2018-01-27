const Images = require('../models/images')
var IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
var multer = require('multer')
var path = require('path')
var fs = require('fs')
var mime = require('mime')

var MAGIC_NUMBERS = {
    jpg: 'ffd8ffe0',
    jpg1: 'ffd8ffe1',
    png: '89504e47',
    gif: '47494638'
}

function checkMagicNumbers(magic) {
  if (magic == MAGIC_NUMBERS.jpg ||
    magic == MAGIC_NUMBERS.jpg1 ||
    magic == MAGIC_NUMBERS.png ||
    magic == MAGIC_NUMBERS.gif
  ) {
    return true
  }
}

// Image upload
exports.uploadImage = function(req, res) {
    const upload = multer({
      dest:'./public/uploads/',
      limits: {
        fileSize: 1000000,
        files:1
      }
    }).single('userImage')

    upload(req, res, function() {
        // var buffer = req.file.buffer
        // var magic = buffer.toString('hex', 0, 4)
        // var filename = req.file.fieldname + '-' + Date.now() + path.extname(req.file.originalname)
        // if (checkMagicNumbers(magic)) {
        //     fs.writeFile('./public/uploads/' + filename, buffer, 'binary', function(err) {
        //         if (err) throw err
        //         res.end('File is uploaded')
        //     })
        // } else {
        //     res.end('File is no valid')
        // }

          const tempPath = req.file.path
          console.log('req.file: ', req.file)
          //get the mime type of the file
          var type = mime.lookup(req.file.mimetype)
          // get file extension
          // var extension = req.file.path.split(/[. ]+/).pop()
          // check support file types
          if (IMAGE_TYPES.indexOf(type) == -1) {
            return res.status(415)
              .send('Supported image formats: jpeg, jpg, jpe, png.')
          }
          // Set new path to images
          const fileName = Date.now() + '_' + req.file.filename +  path.extname(req.file.originalname)
          const targetPath = './public/images/' + fileName
          // using read stream API to read file
          const src = fs.createReadStream(tempPath)
          // using a write stream API to write file
          const dest = fs.createWriteStream(targetPath)
          src.pipe(dest)

          // Show error
          src.on('error', function(err) {
            if (err) {
              console.log('err: ', err)
              return res.status(500).send({
                message: err
              })
            }
          })
          // Save file process
          src.on('end', function() {
            console.log('req.body', req.body)
            // create a new instance of the Images model with request body
            var image = new Images(req.body)
            // Set the image file name
            image.imageName = req.file.originalname
            image.title = req.file.originalname
            image.imagePath = '/images/' + fileName
            // Set current user (id)
            //image.user = req.user;
            // save the data received
            console.log('schema obj: ', image)
            image.save(function(error) {
              if (error) {
                console.log('err: ', error)
                return res.status(400)
                  .send({
                    message: error
                  })
              }
            })

            // remove from temp folder
            fs.unlink(tempPath, function(err) {

              if (err) {
                console.log('err: ', err)
                return res.status(500)
                  .send('Woh, something bad happened here')
              }

              return res.json({ image })
              // Redirect to galley's page
              // res.redirect('images-gallery');

            })
          })

    })
}

exports.getImages = function(req, res) {
  Images.find().sort('-created').exec(function(err, images) {
    console.log(req.session, res.session);
    if (err) {
      res.status(500)
        .json({
          error: err.message
        })
    } else {
      res.session = 'dasdasd'
      res.json(images)
    }
  })
}

exports.getImageById = function(req, res) {
  Images.findById(req.params.image_id, function(err, bear) {
    if (err) {
      res.status(500)
        .json({
          error: err.message
        })
    } else {
      res.json(bear)
    }
  })
}

// // Import modules
// var fs = require('fs');
// var mime = require('mime');
// // get gravatar icon from email
// var gravatar = require('gravatar');

// var Images = require('../models/images');
// // set image file types
// var IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];


// // Show images gallery
// exports.show = function(req, res) {

//   Images.find().sort('-created').populate('user',
//     'local.email').exec(function(error, images) {
//     if (error) {
//       returnres.status(400).send({
//         message: error
//       });
//     }
//     // Render galley
//     res.render('images-gallery', {
//       title: 'Images Gallery',
//       images: images,
//       gravatar: gravatar.url(images.email, {
//           s: '80',
//           r: 'x',
//           d: 'retro'
//         },
//         true)
//     });
//   });
// };


// // Image upload
// exports.uploadImage = function(req, res) {
//   var src;
//   var dest;
//   var targetPath;
//   var targetName;
//   var tempPath = req.file.path;
//   console.log(req.file);
//   //get the mime type of the file
//   var type = mime.lookup(req.file.mimetype);
//   // get file extension
//   var extension = req.file.path.split(/[. ]+/).pop();
//   // check support file types
//   if (IMAGE_TYPES.indexOf(type) == -1) {
//     returnres.status(415).send('Supported image formats: jpeg, jpg, jpe, png.');
//   }
//   // Set new path to images
//   targetPath = './public/images/' + req.file.originalname;
//   // using read stream API to read file
//   src = fs.createReadStream(tempPath);
//   // using a write stream API to write file
//   dest = fs.createWriteStream(targetPath);
//   src.pipe(dest);

//   // Show error
//   src.on('error', function(err) {
//     if (err) {
//       returnres.status(500).send({
//         message: error
//       });
//     }
//   });
//   // Save file process
//   src.on('end', function() {
//     // create a new instance of the Images model with request body
//     var image = new Images(req.body);
//     // Set the image file name
//     image.imageName = req.file.originalname;
//     // Set current user (id)
//     image.user = req.user;
//     // save the data received
//     image.save(function(error) {
//       if (error) {
//         return res.status(400).send({
//           message: error
//         });
//       }
//     });
//     // remove from temp folder
//     fs.unlink(tempPath, function(err) {
//       if (err) {
//         return res.status(500).send('Woh, something bad happened here');
//       }
//       // Redirect to galley's page
//       res.redirect('images-gallery');

//     });
//   });
// };

// // Images authorization middleware
// exports.hasAuthorization = function(req, res, next) {
//   if (req.isAuthenticated())
//     return next();
//   res.redirect('/login');
// };
