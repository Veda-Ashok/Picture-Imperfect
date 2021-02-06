import { createMuiTheme } from '@material-ui/core'
import { deepPurple, amber } from '@material-ui/core/colors'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: deepPurple[500],
    },
    secondary: {
      main: amber[500],
      contrastText: deepPurple[900],
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
        backgroundColor: amber[500],
        color: deepPurple[900],
      },
    },
    containedSecondary: {
      fontWeight: 100,
    },
  },
}
export default theme
