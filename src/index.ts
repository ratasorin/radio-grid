import { Grid } from './components/Grid'
import { randInt } from './util'
import { SquareEventListener } from './components/Square'

import './reset.css'
import './style.css'

const colors = [
  ['#fdc5f5', '#f7aef8', '#b388eb', '#8093f1', '#72ddf7'],
  ['#587291', '#2f97c1', '#1ccad8', '#15e6cd', '#0cf574'],
]

const gridParent = document.createElement('div')
gridParent.classList.add('grid__parent')
document.body.appendChild(gridParent)

const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

const squareMousedown: SquareEventListener = async (square) => {
  await square.destroy(true)
  if (randInt(7) === 6) {
    square.removeEventListener('mousedown')
    await grid.destroy(true)
    await grid.appendTo(gridParent, true)
    square.addEventListener('mousedown', squareMousedown)
  }
}

const grid = new Grid({
  squaresPerRow: 10,
  colors: colors[prefersDarkMode ? 0 : 1],
  squareEventListeners: {
    mousedown: squareMousedown,
  },
})

const main = async () => {
  await grid.appendTo(gridParent, true)
}

main()
