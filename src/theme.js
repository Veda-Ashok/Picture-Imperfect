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

export default theme
