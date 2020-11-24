import ResizeObserver from 'resize-observer-polyfill'
import { Square, SquareEventListeners } from './Square'
import { generateArray, randInt } from '../util'

import './Grid.css'

interface GridProperties {
  target: HTMLElement
  props: {
    width: string
    height: string
    squaresPerRow: number
    colors: string[]
    squareEventListeners?: SquareEventListeners
  }
}

class Grid {
  private readonly element = document.createElement('div')
  private readonly grid = document.createElement('div')
  private readonly colors: string[]
  private readonly squaresPerRow: number
  private squares: Square[]

  constructor(properties: GridProperties) {
    this.element.classList.add('grid__parent')
    properties.target.appendChild(this.element)
    this.grid.classList.add('grid')
    this.element.appendChild(this.grid)
    ;({
      props: {
        colors: this.colors,
        width: this.width,
        height: this.height,
        squaresPerRow: this.squaresPerRow,
      },
    } = properties)
    const { sideLength, count } = this.getSquareData()
    this.squareSideLength = sideLength
    this.squares = generateArray(
      count,
      () =>
        new Square({
          color: this.colors[randInt(this.colors.length)],
          eventListeners: properties.props.squareEventListeners,
        })
    )
    for (const square of this.squares) {
      square.appendTo(this.grid)
    }
    const observer = new ResizeObserver(() => {
      const { count, sideLength } = this.getSquareData()
      const currentCount = this.grid.children.length
      const difference = count - currentCount
      if (difference > 0) {
        const newSquares = generateArray(
          difference,
          () =>
            new Square({
              color: this.colors[randInt(this.colors.length)],
              eventListeners: properties.props.squareEventListeners,
            })
        )
        for (const square of newSquares) {
          square.appendTo(this.grid)
        }
        this.squares = this.squares.concat(newSquares)
      } else {
        this.squares.splice(count).forEach((square) => square.destroy(false))
      }
      this.squareSideLength = sideLength
    })
    observer.observe(this.element)
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
    // TODO: Fix generation of excess squares
    const count =
      (this.squaresPerRow + 1) * (Math.floor(height / sideLength) + 1)
    return { sideLength, count }
  }

  destroy(animate: boolean) {
    return new Promise<void>((resolve) => {
      const remove = () => {
        this.element.remove()
        resolve()
      }
      if (!this.element) {
        resolve()
      }
      if (animate) {
        let promise: Promise<void>
        const interval = setInterval(async () => {
          if (this.squares.length === 0) {
            clearInterval(interval)
            await promise
            remove()
          }
          promise = this.squares.pop()?.destroy(true) || promise
        }, 50)
      } else {
        remove()
      }
    })
  }
}

export { Grid, GridProperties }
