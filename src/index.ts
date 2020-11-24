import Grid from './Grid'
import { generateArray } from './util'

const colors = [['#fdc5f5', '#f7aef8', '#b388eb', '#8093f1', '#72ddf7']]

const grids: Grid[] = generateArray(colors.length, (_, i) => {
  const parent = document.createElement('div')
  parent.classList.add('grid__parent')
  document.body.appendChild(parent)
  const size = 100 / colors.length

  return new Grid({
    target: parent,
    props: {
      width: `${size}vw`,
      height: `${size}vh`,
      squaresPerRow: 10,
      colors: colors[i],
    },
  })
})
