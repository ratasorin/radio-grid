import ResizeObserver from 'resize-observer-polyfill'
import { Square, SquareEventListeners } from './Square'
import { generateArray, randInt } from '../util'

import './Grid.css'

interface GridProperties {
  width: string
  height: string
  colors: string[]
  squaresPerRow: number
  squareEventListeners?: SquareEventListeners
}

const generateSquares = (count: number, colors: string[], events?: SquareEventListeners) =>
  generateArray(
    count,
    () =>
      new Square({
        color: colors[randInt(colors.length)],
        eventListeners: events,
      })
  )

class Grid {
  private readonly element = document.createElement('div')
  private readonly grid = document.createElement('div')
  private readonly colors: string[]
  private readonly squareEvents?: SquareEventListeners
  private readonly squaresPerRow: number
  private squares: Square[] = []
  private readonly resizeObserver: ResizeObserver

  constructor(properties: GridProperties) {
    this.element.classList.add('grid__parent')
    this.grid.classList.add('grid')
    this.element.appendChild(this.grid)
    ;({
      colors: this.colors,
      width: this.width,
      height: this.height,
      squaresPerRow: this.squaresPerRow,
      squareEventListeners: this.squareEvents,
    } = properties)
    this.resizeObserver = new ResizeObserver(() => {
      const { count, sideLength } = this.getSquareData()
      const currentCount = this.grid.children.length
      const difference = count - currentCount
      if (difference > 0) {
        const newSquares = generateSquares(difference, this.colors, this.squareEvents)
        for (const square of newSquares) {
          square.appendTo(this.grid, false)
        }
        this.squares = this.squares.concat(newSquares)
      } else {
        this.squares.splice(count).forEach((square) => square.destroy(false))
      }
      this.squareSideLength = sideLength
    })
  }

  private get width(): string {
    return this.element.style.getPropertyValue('--width')
  }

  private set width(width: string) {
    this.element.style.setProperty('--width', width)
  }

  private getWidth(): number {
    return parseInt(window.getComputedStyle(this.element).width, 10)
  }

  private get height(): string {
    return this.element.style.getPropertyValue('--height')
  }

  private set height(height: string) {
    this.element.style.setProperty('--height', height)
  }

  private getHeight(): number {
    return parseInt(window.getComputedStyle(this.element).height, 10)
  }

  private get squareSideLength(): number {
    return parseInt(this.grid.style.getPropertyValue('--size'), 10)
  }

  private set squareSideLength(squareSideLength: number) {
    this.grid.style.setProperty('--size', `${squareSideLength}px`)
  }

  private getSquareData() {
    const width = this.getWidth()
    const height = this.getHeight()
    const sideLength = Math.max(width, height) / this.squaresPerRow
    const count = (this.squaresPerRow + 1) * Math.floor(Math.min(width, height) / sideLength + 1)
    return { sideLength, count }
  }

  async appendTo(parent: Node, animate: boolean): Promise<void> {
    parent.appendChild(this.element)
    const { sideLength, count } = this.getSquareData()
    this.squareSideLength = sideLength
    this.squares = generateSquares(count, this.colors, this.squareEvents)
    if (animate) {
      await new Promise<void>((resolve) => {
        const it = this.squares.values()
        let promise: Promise<void> | undefined
        const interval = setInterval(() => {
          const square = it.next()
          if (square.done) {
            clearInterval(interval)
            promise?.then(resolve)
            return
          }
          promise = square.value.appendTo(this.grid, true)
        }, 50)
      })
    } else {
      for (const square of this.squares) {
        square.appendTo(this.grid, false)
      }
    }
    this.resizeObserver.observe(this.element)
  }

  async destroy(animate: boolean): Promise<void> {
    if (animate) {
      await new Promise<void>((resolve) => {
        let promise: Promise<void> | undefined
        const interval = setInterval(() => {
          if (this.squares.length === 0) {
            clearInterval(interval)
            promise?.then(resolve)
            return
          }
          promise = this.squares.pop()?.destroy(true)
        }, 50)
      })
    }
    this.element.remove()
  }
}

export { Grid, GridProperties }
