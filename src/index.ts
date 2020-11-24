import { Grid, GridProperties } from './components/Grid'
import { generateArray, randInt } from './util'

import './reset.css'
import './style.css'

const colors = [['#fdc5f5', '#f7aef8', '#b388eb', '#8093f1', '#72ddf7']]

// TODO: Fix bug where multiple grids are created
const grids: Grid[] = generateArray(colors.length, (_, i) => {
  const size = 100 / colors.length
  let grid: Grid
  const gridProperties: GridProperties = {
    target: document.body,
    props: {
      width: `${size}vw`,
      height: `${size}vh`,
      squaresPerRow: 10,
      colors: colors[i],
      squareEventListeners: {
        click: async (square) => {
          await square.destroy(true)
          if (randInt(7) === 6) {
            await grid.destroy(true)
            grids[i] = new Grid(gridProperties)
          }
        },
      },
    },
  }
  grid = new Grid(gridProperties)
  return grid
})
