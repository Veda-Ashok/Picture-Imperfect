import { createMuiTheme } from '@material-ui/core'
import { amber, grey } from '@material-ui/core/colors'

const babyBlue = '#B2DAFF'
const cgRed = '#BF211E'
const white = '#FFFFFF'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: amber[200],
    },
    secondary: {
      main: white,
    },
    error: {
      main: cgRed,
    },
  },
  typography: {
    fontFamily: ['Raleway', 'sans-serif'].join(','),
    h1: {
      fontFamily: ['Ribeye', 'cursive'].join(','),
    },
  },
})

theme.props = {
  MuiButton: {
    disableElevation: true,
  },
}

theme.overrides = {
  MuiButton: {
    root: {
      textTransform: 'none',
    },
    containedPrimary: {
      '&:hover': {
        backgroundColor: amber[400],
      },
    },
    containedSecondary: {
      '&:hover': {
        backgroundColor: grey[100],
      },
    },
  },
  MuiCssBaseline: {
    '@global': {
      body: {
        backgroundColor: babyBlue,
      },
    },
  },
}
export default theme
