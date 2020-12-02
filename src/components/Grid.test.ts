import fs from 'fs'
import path from 'path'
import { Component } from '../internal/Component'
import { randInt } from '../util'
import { Grid } from './Grid'

const fireClick = (element: Node) => {
  const ev = document.createEvent('MouseEvents')
  ev.initEvent('click', true, false)
  element.dispatchEvent(ev)
}

test('Grid', async () => {
  document.write(fs.readFileSync(path.resolve(__dirname, '..', '..', 'public', 'index.html')).toString())
  const parentDOM = document.querySelector('.grid__parent') as HTMLElement
  expect(parentDOM).not.toBeNull()
  const colors = ['#000', '#fff']
  const squareCount = 48
  const grid = new Grid({
    squareCount: squareCount,
    colors: colors,
    squareEventListeners: [
      {
        event: 'click',
        async callback() {
          expect(colors).toContain(this.color)
          const prevSquareCount = grid.squareCount
          await grid.removeSquare(this).destroy(false)
          expect(grid.squareCount).toBe(prevSquareCount - 1)
        },
      },
    ],
  })
  await grid.create(Component.from(parentDOM), false)
  expect(parentDOM.children.length).toBe(1)
  const gridDOM = parentDOM.querySelector('.grid') as HTMLElement
  expect(gridDOM).not.toBeNull()
  expect(gridDOM.children.length).toBe(squareCount)
  fireClick(gridDOM.children.item(randInt(gridDOM.childNodes.length)) as Element)
})