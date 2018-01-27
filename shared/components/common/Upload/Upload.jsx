import React from 'react'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Input from 'material-ui/Input'
import { CircularProgress } from 'material-ui/Progress'
import CloudUpload from 'material-ui-icons/CloudUpload'
import styles from './styles.scss'

const Upload = props => (
  <Paper className={styles.wrapper}>
    <CloudUpload className={styles.icon} />
    <Typography
      type='title'
      className={styles.title}>
      Drag Images here or
    </Typography>
    <Button
      raised
      color='accent'
      component='label'
      className={styles.button}>
      {'Browse'}
      <input
        onChange={props.handleImageChange}
        style={{ display: 'none' }}
        type='file'
        accept='image/x-png,image/gif,image/jpeg'
      />
    </Button>
    <Typography
      type='title'
      className={styles.title}>
        from your computer.
    </Typography>
  </Paper>
)

export const Loading = () => (
  <Paper className={styles.wrapper}>
    <Typography type='title'>Loading...</Typography>
    <CircularProgress color='accent' size={100} />
  </Paper>
)


export default Upload
