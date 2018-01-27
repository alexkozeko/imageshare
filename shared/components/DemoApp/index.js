import 'normalize.css/normalize.css';

import React from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Helmet from 'react-helmet';

import Reboot from 'material-ui/Reboot'

import config from '../../../config';

import './globals.css'
import styles from './styles.scss'

import Grid from 'material-ui/Grid'
import Error404 from './Error404'
import Header from './Header'

import AsyncHomeRoute from './AsyncHomeRoute'
import AsyncCounterRoute from './AsyncCounterRoute'
import AsyncPostsRoute from './AsyncPostsRoute'
import AsyncAboutRoute from './AsyncAboutRoute'
import AsyncBearsRoute from './AsyncBearsRoute'

// import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
// import blue from 'material-ui/colors/blue'
// import grey from 'material-ui/colors/grey'
// import red from 'material-ui/colors/red';
//
// //
// // const defaultTheme = createMuiTheme()
// const theme = createMuiTheme({
//   palette: {
//     contrastThreshold: 3.1,
//     tonalOffset: 0.07,
//     primary: {
//       light: blue[300],
//       main: blue[500],
//       dark: blue[700]
//     },
//     secondary: {
//       light: grey.A200,
//       main: grey.A400,
//       dark: grey.A700
//     }
//   },
// })

function DemoApp() {
  return (
    <div className={styles.app}>
      <Reboot />
      <Helmet>
        <html lang="en" />
        <title>{config('htmlPage.defaultTitle')}</title>
        <meta name="application-name" content={config('htmlPage.defaultTitle')} />
        <meta name="description" content={config('htmlPage.description')} />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet" />
      </Helmet>
      <Header />
      <div className={styles.wrapper}>
        <Switch>
          <Route exact path="/" component={AsyncHomeRoute} />
          <Route path="/counter" component={AsyncCounterRoute} />
          <Route path="/posts" component={AsyncPostsRoute} />
          <Route path="/about" component={AsyncAboutRoute} />
          <Route path="/bears" component={AsyncBearsRoute} />
          <Route component={Error404} />
        </Switch>
      </div>
      <footer className={styles.footer}>Footer</footer>
    </div>
  );
}

export default DemoApp;
