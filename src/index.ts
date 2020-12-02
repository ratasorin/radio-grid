import './reset.css'
import './style.css'

import { Grid } from './components/Grid'
import { randInt } from './util'
import { Square } from './components/Square'
import { Component } from './internal/Component'

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
    grid.removeSquare(this).destroy(true)
    if (grid.squareCount === randInt(grid.squareCount + 1)) {
      ignoreClicks = true
      await grid.destroy(true)
      await grid.create(gridParent, true)
    }
    ignoreClicks = false
  }
})()

const grid = new Grid({
  squareCount: 48,
  colors: ['cotton-candy', 'mauve', 'lavender-floral', 'cornflower-blue', 'sky-blue'].map((color) => `var(--color-${color})`),
  squareEventListeners: [
    {
      event: 'mousedown',
      callback: squareMousedown,
    },
  ],
})

const main = async () => {
  await grid.create(gridParent, true)
}

main()
