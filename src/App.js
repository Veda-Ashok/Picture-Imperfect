import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import HomePage from './components/home/HomePage'
import LobbyPage from './components/lobby/LobbyPage'
import GamePage from './components/game/GamePage'
import theme from './theme'
import GlobalState from './context/GlobalState'
import TestingScreenshotPage from './components/reusable/TestingScreenshotPage'

export default function App() {
  return (
    <GlobalState>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Switch>
            <Route exact path="/testing">
              <TestingScreenshotPage />
            </Route>
            <Route exact path="/lobby">
              <LobbyPage />
            </Route>
            <Route exact path="/game">
              <GamePage />
            </Route>
            <Route exact path="/">
              <HomePage />
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </GlobalState>
  )
}
