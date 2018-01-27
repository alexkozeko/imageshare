const Bear = require('../models/bear')

exports.createBear = function(req, res) {
  const bear = new Bear()

  bear.name = req.body.name
  bear.image = req.body.image

  bear.save(function(err) {
    if (err) {
      res.status(500)
        .json({
          error: err.message
        })
    } else {
      res.json({
        message: 'Bear has been created!',
        data: bear
      })
    }

  })
}

exports.getBears = function(req, res) {
  Bear.find(function(err, bears) {
    if (err) {
      res.status(500)
        .json({
          error: err.message
        })
    } else {
      res.json(bears)
    }
  })
}

exports.getBearById = function(req, res) {
  Bear.findById(req.params.bear_id, function(err, bear) {
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

exports.editBear = function(req, res) {
  Bear.findById(req.params.bear_id, function(err, bear) {
    if (err) {
      res.status(500)
        .json({
          error: err.message
        })
    } else {
      if (!bear) {
        res.status(404)
          .json({
            error: 'Bear not found'
          })
        return
      }

      if (req.body.name) {
        bear.name = req.body.name
      }

      if (req.body.image) {
        bear.image = req.body.image
      }

      // save the bear
      bear.save(function(err) {
        if (err) {
          res.status(400)
            .json({
              error: err.message
            })
        } else {
          res.json({
            message: 'Bear has been updated!',
            data: bear
          })
        }
      })

    }
  })
}

exports.deleteBear = function(req, res) {
  Bear.remove({
    _id: req.params.bear_id
  }, function(err, bear) {
    if (err) {
      res.status(500)
        .json({
          error: err.message
        })
    } else {
      res.json({
        message: 'Successfully deleted',
        bear
      })
    }
  })
}
