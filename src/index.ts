import './reset.css'
import './style.css'

import { Grid } from './components/Grid'
import { baseLog, isDefined, randInt } from './util'
import { Square, SquareEventListener } from './components/Square'
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

const squareMousedown: SquareEventListener = {
  event: 'mousedown',
  callback: (() => {
    let ignoreClicks = false
    // TODO: Better square removal method
    return async function (this: Square) {
      if (ignoreClicks) {
        return
      }
      grid.removeSquare(this).destroy(true)
      log('%d squares left', grid.squareCount)
      const rand = randInt(7)
      log(`Random number generated: ${rand}`)
      if (rand === 6) {
        ignoreClicks = true
        await grid.destroy(true)
        await grid.create(gridParent, true)
      }
      ignoreClicks = false
    }
  })(),
}

const grid = new Grid({
  colors: colorSchemes[prefersDarkMode.matches ? 0 : 1],
  squareEventListeners: [squareMousedown],
})

function colorSchemeListener(this: MediaQueryList, ev: MediaQueryListEvent): void {
  if (ev.matches) {
    grid.setColors(colorSchemes[0])
  } else {
    grid.setColors(colorSchemes[1])
  }
}

if (isDefined(prefersDarkMode.addEventListener)) {
  prefersDarkMode.addEventListener('change', colorSchemeListener)
} else {
  // for Safari
  prefersDarkMode.addListener(colorSchemeListener)
}

const main = async () => {
  await grid.create(gridParent, true)
}

main()
