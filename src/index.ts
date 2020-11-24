import Grid from './components/Grid/Grid'
import { generateArray } from './util'

import './reset.css'
import './style.css'

const colors = [['#fdc5f5', '#f7aef8', '#b388eb', '#8093f1', '#72ddf7']]

const grids: Grid[] = generateArray(colors.length, (_, i) => {
  const size = 100 / colors.length
  return new Grid({
    target: document.body,
    props: {
      width: `${size}vw`,
      height: `${size}vh`,
      squaresPerRow: 10,
      colors: colors[i],
    },
  })
})
