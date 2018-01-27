import React from 'react'
import Link from 'react-router-dom/Link'
import Button from 'material-ui/Button'
import styles from './styles.scss'

function Menu() {
  return (
    <div>
      <Button color='contrast' className={styles.item}>
        <Link to='/'>Home</Link>
      </Button>
      <Button color='contrast' className={styles.item}>
        <Link to='/counter'>Counter</Link>
      </Button>
      <Button color='contrast' className={styles.item}>
        <Link to='/about'>About</Link>
      </Button>
      <Button color='contrast' className={styles.item}>
        <Link to='/bears'>Bears</Link>
      </Button>
    </div>
  )
}

export default Menu
