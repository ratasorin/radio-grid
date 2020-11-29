import './reset.css'
import './style.css'

import { Grid } from './components/Grid'
import { baseLog, randInt } from './util'
import { Square } from './components/Square'
import { Component } from './internal/Component'

const log = baseLog.extend('index')

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

const squareMousedown = (() => {
  let ignoreClicks = false

  return async function (this: Square) {
    if (ignoreClicks) {
      return
    }
    grid.removeSquare(this, true)
    log(`${grid.squares.length} squares left`)
    const rand = randInt(7)
    log(`Random number generated: ${rand}`)
    if (rand === 6) {
      ignoreClicks = true
      await grid.destroy(true)
      await grid.create(gridParent, true)
    }
    ignoreClicks = false
  }
})()

const grid = new Grid({
  squareCount: 48,
  colors: colorSchemes[prefersDarkMode.matches ? 0 : 1],
  squareEventListeners: [
    {
      event: 'mousedown',
      callback: squareMousedown,
    },
  ],
})

prefersDarkMode.addEventListener('change', (ev) => {
  if (ev.matches) {
    grid.setColors(colorSchemes[0])
  } else {
    grid.setColors(colorSchemes[1])
  }
})

const main = async () => {
  await grid.create(gridParent, true)
}

main()
