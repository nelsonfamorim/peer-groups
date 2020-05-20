import { render } from 'react-dom'
import React, { useState } from 'react'
import { useSprings, animated, interpolate } from 'react-spring'
import getRandom from './getRandom'
import calculateCardTranslate from './calculate-card-translate'
import './styles.css'
import questionList from './questions.json'

const CARD_BG = 'https://uploads.codesandbox.io/uploads/user/d20a3f7b-a068-4d55-ae4d-1b03547ca705/vmXx-v3.jpg'
const CARD_COUNT = 20
const questions = getRandom(questionList, CARD_COUNT)

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = i => ({ x: 0, y: i * -4, rot: -10 + Math.random() * 20, delay: i * 100, rotY: 0, scale: 1 })
const from = i => ({ x: 0, rot: 0, y: -1000, flipped: false })
// This is being used down there in the view, it interpolates rotation into a css transform
const trans = (rZ, rY) => `perspective(1500px) rotateX(30deg) rotateY(${rY}deg) rotateZ(${rZ}deg)`

function Deck() {
  const [state, setState] = useState(() => {
    return { gone: new Set(), selectedCard: undefined }
  }) // The set flags all the cards that are flicked out
  const [props, set] = useSprings(questions.length, i => ({ ...to(i), from: from(i) })) // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const onClick = index => {
    setState({ gone: state.gone, selectedCard: state.selectedCard })
    // there is a selected card that was not clicked, ignore the click
    if (state.selectedCard && state.selectedCard !== index) return
    let newSelectedCard
    if (state.selectedCard) {
      state.gone.add(index)
      newSelectedCard = undefined
    } else {
      newSelectedCard = index
    }
    set(i => {
      if (index !== i) return // We're only interested in changing spring-data for the current spring
      if (state.gone.has(i)) {
        return { x: -2000, rot: 90, delay: undefined, rotY: 180, scale: 1.5 }
      }
      const [translateX, translateY] = calculateCardTranslate(i)
      return { x: translateX, y: translateY, rot: 90, delay: undefined, rotY: 180, scale: 1.5 }
    })
    setState({ gone: state.gone, selectedCard: newSelectedCard })
  }
  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return props.map(({ x, y, rot, rotY, scale }, i) => (
    <animated.div
      id={`card-${i}`}
      key={i}
      style={{ transform: interpolate([x, y, scale], (x, y, scale) => `translate3d(${x}px,${y}px,0) scale(${scale})`) }}>
      {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
      <animated.div onClick={() => onClick(i)} style={{ transform: interpolate([rot, rotY], trans) }}>
        <div className="card-front">
          <img src={CARD_BG} alt="" />
        </div>
        <div className="card-back">
          <div>
            <p>
              <p className="category">{questions[i].category}</p>
              {questions[i].question}
            </p>
          </div>
        </div>
      </animated.div>
    </animated.div>
  ))
}

render(<Deck />, document.getElementById('root'))
