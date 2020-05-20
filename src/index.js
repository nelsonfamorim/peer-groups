import { render } from 'react-dom'
import React from 'react'
import Deck from './Deck'
import Timer from './Timer'
import './base.css'

function App() {
  return (
    <>
      <Deck />
      <Timer />
    </>
  )
}

render(<App />, document.getElementById('root'))
