import './reset.css'
import './style.css'

import { Grid } from './components/Grid'
import { log, randInt } from './util'
import { SquareEventListener } from './components/Square'
import { Component } from './internal/Component'

const colorSchemes = [
  ['#fdc5f5', '#f7aef8', '#b388eb', '#8093f1', '#72ddf7'],
  ['#587291', '#2f97c1', '#1ccad8', '#15e6cd', '#0cf574'],
]

const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')

const gridParentDOM = document.querySelector<HTMLElement>('.grid__parent')
if (!gridParentDOM) {
  throw new Error(`Grid parent doesn't exist in the HTML document!`)
}
const gridParent = Component.from(gridParentDOM)

let ignoreClicks = false

const squareMousedown: SquareEventListener<'mousedown'> = async function () {
  if (ignoreClicks) {
    return
  }
  const removed = grid.removeSquare(this, true)
  log(`${grid.existingSquares.length} squares left`)
  const rand = randInt(7)
  log(`Random integer generated: ${rand}`)
  if (rand === 6) {
    ignoreClicks = true
    await removed
    await grid.destroy(true)
    await grid.create(gridParent, true)
  }
  ignoreClicks = false
}

const grid = new Grid({
  squareCount: 48,
  colors: colorSchemes[prefersDarkMode.matches ? 0 : 1],
  squareEventListeners: {
    mousedown: squareMousedown,
  },
})

const main = async () => {
  await grid.create(gridParent, true)
  prefersDarkMode.addEventListener('change', (ev) => {
    if (ev.matches) {
      grid.setColors(colorSchemes[0])
    } else {
      grid.setColors(colorSchemes[1])
    }
  })
}

main()
