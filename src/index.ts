import { Grid } from './components/Grid'
import { randInt } from './util'

import './reset.css'
import './style.css'

const colors = [
  ['#fdc5f5', '#f7aef8', '#b388eb', '#8093f1', '#72ddf7'],
  ['#587291', '#2f97c1', '#1ccad8', '#15e6cd', '#0cf574'],
]

const grid = new Grid({
  width: `100vw`,
  height: `100vh`,
  squaresPerRow: 10,
  colors: colors[randInt(colors.length)],
})

const main = async () => {
  await grid.appendTo(document.body, true)
}

main()
