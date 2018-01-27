import React from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import FileUpload from 'material-ui-icons/FileUpload';

import Logo from './Logo';
import Menu from './Menu';

import styles from './styles.scss';

function Header() {
  return (
    <AppBar position='static' className='header'>
      <Toolbar>
        <Typography type='title' color='inherit' className={styles.flex}>
          Title
        </Typography>
        <Button className={styles.flex} raised color='accent'>
          Upload
          <FileUpload className={styles.rightIcon} />
        </Button>
        <Menu />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
