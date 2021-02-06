import React from 'react'
import { Button } from '@material-ui/core'
import PropTypes from 'prop-types'

const StyledButton = ({ color, text }) => {
  return (
    <Button variant="contained" color={color}>
      {text}
    </Button>
  )
}

StyledButton.propTypes = {
  color: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
}

export default StyledButton
