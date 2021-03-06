/* eslint-disable no-console */

import express from 'express';
import compression from 'compression';
import path, { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import reactApplication from './middleware/reactApplication';
import security from './middleware/security';
import clientBundle from './middleware/clientBundle';
import serviceWorker from './middleware/serviceWorker';
import offlinePage from './middleware/offlinePage';
import errorHandlers from './middleware/errorHandlers';
import config from '../config';

import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

// import multer
import multer from 'multer'

const upload = multer({
  dest:'./public/uploads/',
  limits: {
    fileSize: 1000000,
    files:1
  }
});

// Import login controller
var auth = require('./controllers/auth');
// Import comments controller
var comments = require('./controllers/comments');
var imagesController = require('./controllers/images');
var bearController = require('./controllers/bear');

 // ODM with Mongoose
var mongoose = require('mongoose');
// Modules to store session
var session = require('express-session');
var cookieSession = require('cookie-session')
var MongoStore = require('connect-mongo')(session);
// Import Passport and Warning flash modules
var passport = require('passport');
var flash = require('connect-flash');

var serverConfig = require('./config/config.js');
// connect to our database
mongoose.Promise = global.Promise
mongoose.connect(serverConfig.url, { useMongoClient: true, keepAlive: true })
 // Check if MongoDB is running
mongoose.connection.on('error', function() {
   console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});
// Passport configuration
// require('./config/passport')(passport);


// start express application in variable app.
var app = express();

// Don't expose any software information to potential hackers.
app.disable('x-powered-by');

// Security middlewares.
app.use(...security);

// Gzip compress the responses.
app.use(compression());

app.set('trust proxy', 1)
app.use(cookieSession({
      name: 'unathorizedSession',
      secret: 'stringrand',
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
      secure: false,
      overwrite: false,
      saveUninitialized: true
}))


// Register our service worker generated by our webpack config.
// We do not want the service worker registered for development builds, and
// additionally only want it registered if the config allows.
if (process.env.BUILD_FLAG_IS_DEV === 'false' && config('serviceWorker.enabled')) {
  app.get(`/${config('serviceWorker.fileName')}`, serviceWorker);
  app.get(
    `${config('bundles.client.webPath')}${config('serviceWorker.offlinePageFileName')}`,
    offlinePage,
  );
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// required for passport
// secret for session
app.use(session({
secret: 'sometextgohere',
saveUninitialized: true,
resave: true,
     //store session on MongoDB using express-session + connect mongo
store: new MongoStore({
url: serverConfig.url,
collection : 'sessions'
    })
}));

// Init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());
// flash messages
app.use(flash());

// Configure serving of our client bundle.
app.use(config('bundles.client.webPath'), clientBundle);

// Configure static serving of our "public" root http path static files.
// Note: these will be served off the root (i.e. '/') of our application.
app.use(express.static(pathResolve(appRootDir.get(), config('publicAssetsPath'))));


 // Application Routes
      app.post('/api/login', passport.authenticate('local-login', {
         //Success go to Profile Page / Fail go to login page
      successRedirect : '/profile',
      failureRedirect : '/login',
      failureFlash : true
      }));
      app.post('/api/signup', passport.authenticate('local-signup', {
        //Success go to Profile Page / Fail go to Signup page
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
      }));
      // Logout Page
      app.get('/api/logout', function(req, res) {
        req.logout();
        res.redirect('/');
       });

      app.post('/api/comments', comments.hasAuthorization, comments.create);

      // Setup routes for images

      app.route('/api/images')
        .get(imagesController.getImages)
        .post(imagesController.uploadImage)

      app.route('/api/images:image_id')
        .get(imagesController.getImageById)

      app.route('/api/bears')
        .get(bearController.getBears)
        .post(bearController.createBear)
      app.route('/api/bears/:bear_id')
        .get(bearController.getBearById)
        .put(bearController.editBear)
        .delete(bearController.deleteBear)

// The React application middleware.
app.get('*', reactApplication)

// Error Handler middlewares.
app.use(...errorHandlers);








// Create an http listener for our express app.
const listener = app.listen(config('port'), () =>
console.log(`Server listening on port ${config('port')}`));

// We export the listener as it will be handy for our development hot reloader,
// or for exposing a general extension layer for application customisations.
export default listener;
