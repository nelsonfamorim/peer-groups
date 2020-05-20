import React, { useState, useEffect, useRef } from 'react'
import './Timer.css'

const SECONDS_IN_A_MINUTE = 60
const MINUTES_PER_QUESTION = 15
const TIME_PER_QUESTION = MINUTES_PER_QUESTION * SECONDS_IN_A_MINUTE

function useInterval(callback, delay) {
  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

function useTimer(startAt) {
  const [isPaused, setIsPaused] = useState(true)
  const [elapsed, setElapsed] = useState(() => startAt)

  useInterval(
    () => {
      if (elapsed === 0) {
        return setIsPaused(true)
      }

      return setElapsed(elapsed - 1)
    },
    isPaused ? null : 1000
  )

  return {
    elapsed,
    isPaused,
    hasStarted: elapsed !== startAt,
    hasFinished: elapsed === 0,
    minutes: Math.floor(elapsed / SECONDS_IN_A_MINUTE),
    seconds: elapsed % SECONDS_IN_A_MINUTE,
    pause: () => setIsPaused(true),
    start: () => setIsPaused(false),
    clear: () => {
      !isPaused && setIsPaused(true)
      setElapsed(startAt)
    }
  }
}

export default function Timer() {
  const { start, clear, pause, isPaused, hasStarted, hasFinished, minutes, seconds } = useTimer(TIME_PER_QUESTION)

  return (
    <div className="Timer">
      <div className="Timer-numbers">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div>
        {isPaused && !hasFinished ? (
          <button className="Timer-actionButton" type="button" onClick={start}>
            {hasStarted ? 'resume' : 'start'}
          </button>
        ) : null}

        {!isPaused && !hasFinished ? (
          <button className="Timer-actionButton" type="button" onClick={pause}>
            pause
          </button>
        ) : null}

        {hasStarted ? (
          <button className={`Timer-actionButton ${!hasFinished ? 'Timer-actionButton-margin' : ''}`} type="button" onClick={clear}>
            clear
          </button>
        ) : null}
      </div>
    </div>
  )
}
