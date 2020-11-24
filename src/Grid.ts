import ResizeObserver from 'resize-observer-polyfill'
import Square from './Square'
import { generateArray, randInt } from './util'

interface GridProperties {
  target: HTMLElement
  props: {
    width: string
    height: string
    squaresPerRow: number
    colors: string[]
  }
}

export default class Grid {
  private readonly element: HTMLElement
  private readonly grid = document.createElement('div')
  private readonly colors: string[]
  private readonly squaresPerRow: number
  private observer: ResizeObserver
  private squares: Square[]

  constructor(properties: GridProperties) {
    ;({
      target: this.element,
      props: {
        colors: this.colors,
        width: this.width,
        height: this.height,
        squaresPerRow: this.squaresPerRow,
      },
    } = properties)
    this.grid.classList.add('grid')
    this.element.appendChild(this.grid)
    const { sideLength, count } = this.getSquareData()
    this.squareSideLength = sideLength
    this.squares = generateArray(
      count,
      () =>
        new Square({
          color: this.colors[randInt(this.colors.length)],
        })
    )
    for (const square of this.squares) {
      square.appendTo(this.grid)
    }
    this.observer = new ResizeObserver(() => {
      const { count, sideLength } = this.getSquareData()
      const currentCount = this.grid.children.length
      const difference = count - currentCount
      if (difference > 0) {
        const newSquares = generateArray(
          difference,
          () =>
            new Square({
              color: this.colors[randInt(this.colors.length)],
            })
        )
        for (const square of newSquares) {
          square.appendTo(this.grid)
        }
        this.squares = this.squares.concat(newSquares)
      } else {
        this.squares
          .splice(count, -difference)
          .forEach((square) => square.destroy())
      }
      this.squareSideLength = sideLength
    })
    this.observer.observe(this.element)
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
    const count =
      (this.squaresPerRow + 2) * (Math.floor(height / sideLength) + 2)
    return { sideLength, count }
  }

  destroy() {
    this.observer.disconnect()
    this.grid.remove()
  }
}