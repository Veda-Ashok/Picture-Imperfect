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
  text: {
    primary: '#000',
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
      border: '3px solid',
      borderColor: '#000',
    },
    containedPrimary: {
      '&:hover': {
        backgroundColor: amber[400],
      },
    },
    containedSecondary: {
      '&:hover': {
        backgroundColor: grey[200],
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
  MuiDialog: {
    paper: {
      borderWidth: 3,
      borderRadius: 3,
      borderColor: '#000',
      borderStyle: 'solid',
    },
  },
}
export default theme
