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
    h2: {
      fontFamily: ['Ribeye', 'cursive'].join(','),
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
})

theme.props = {
  MuiButton: {
    disableElevation: true,
  },
  // MuiInputLabel: {
  //   shrink: false,
  // },
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
      html: {
        height: '100%',
      },
      body: {
        backgroundColor: babyBlue,
        height: '100%',
        margin: '0px',
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
  MuiDialogContent: {
    dividers: {
      borderTop: '3px solid',
      borderBottom: '3px solid',
      borderColor: '#000',
    },
  },
  MuiOutlinedInput: {
    root: {
      '& $notchedOutline': {
        borderColor: '#000',
      },
      '&:hover $notchedOutline': {
        border: '3px solid',
        borderColor: '#000',
      },
      '&$focused $notchedOutline': {
        borderColor: '#000',
      },
    },
  },
  MuiInputLabel: {
    root: {
      color: 'black',
      '&$focused': {
        color: '#000',
      },
    },
  },
  MuiCheckbox: {
    root: {
      color: 'black',
    },
  },
  MuiAvatar: {
    root: {
      width: '80px',
      height: '80px',
      border: '3px solid black',
      background: 'white',
    },
  },
  MuiDivider: {
    root: {
      backgroundColor: 'black',
    },
  },
}
export default theme
