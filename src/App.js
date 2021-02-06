import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import HomePage from './components/home/HomePage'
import Board from './components/game/Board'
import theme from './theme'
import GlobalState from './context/GlobalState'

export default function App() {
  return (
    <GlobalState>
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/gameOver">
              <h1>GameOver</h1>
            </Route>
            <Route exact path="/lobby">
              <h1>Lobby</h1>
            </Route>
            <Route exact path="/create">
              <h1>Create Game</h1>
            </Route>
            <Route exact path="/join">
              <h1>Join Game</h1>
            </Route>
            <Route exact path="/game">
              <Board />
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
