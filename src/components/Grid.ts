import './Grid.css'

import { Component } from '../internal/Component'
import { Square, SquareEventListeners } from './Square'
import { generateArray, log, randInt, wait } from '../util'
import ResizeObserver from 'resize-observer-polyfill'

interface GridProperties {
  colors: string[]
  squareCount: number
  squareEventListeners?: SquareEventListeners
}

const generateSquares = (startID: number, props: GridProperties) =>
  generateArray<Square>(
    props.squareCount,
    () =>
      new Square({
        color: props.colors[randInt(props.colors.length)],
        eventListeners: props.squareEventListeners,
      })
  )

class Grid extends Component<HTMLDivElement> {
  private readonly properties: GridProperties
  private _squares: Square[] = []
  private readonly resizeObserver: ResizeObserver

  constructor(properties: GridProperties) {
    super({ tag: 'div', classList: ['grid'] })
    this.properties = properties
    this.addClass('grid')
    this.resizeObserver = new ResizeObserver(() => {
      const { sideLength } = this.getSquareData()
      this.squareSideLength = sideLength
    })
  }

  removeSquare(square: Square, animate: boolean): Promise<void> {
    const i = this.squares.indexOf(square)
    log(`Square ${i} will be removed`)
    return this._squares.splice(i, 1)[0].destroy(animate)
  }

  get squares(): ReadonlyArray<Square> {
    return this._squares
  }

  private getWidth(): number {
    return parseInt(this.getComputedStyle('width'), 10)
  }

  private getHeight(): number {
    return parseInt(this.getComputedStyle('height'), 10)
  }

  private get squareSideLength(): number {
    return parseInt(this.getStyle('--size'), 10)
  }

  private set squareSideLength(squareSideLength: number) {
    this.setStyle('--size', `${squareSideLength}px`)
  }

  private async appendSquares(squares: Square[], animate: boolean): Promise<void> {
    let promise: Promise<void> | undefined
    for (const square of squares) {
      promise = square.create(this, animate)
      if (animate) {
        await wait(50)
      }
    }
    return promise
  }

  private getSquareData() {
    const count = this.properties.squareCount
    const width = this.getWidth()
    const height = this.getHeight()
    const sideLength = Math.sqrt((width * height) / count)
    return { sideLength }
  }

  setColors(colors: string[]): void {
    this.properties.colors = colors
    this._squares.forEach((square) => (square.color = colors[randInt(colors.length)]))
  }
  async create<T extends HTMLElement>(parent: Component<T>, animate: boolean): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    this.appendTo(parent)
    const { sideLength } = this.getSquareData()
    this.squareSideLength = sideLength
    this._squares = generateSquares(0, this.properties)
    this.addClass('grid--no-interaction')
    await this.appendSquares(this._squares, animate)
    this.resizeObserver.observe(this.element)
    this.removeClass('grid--no-interaction')
  }

  async destroy(animate: boolean): Promise<void> {
    this.resizeObserver.disconnect()
    this.addClass('grid--no-interaction')
    if (animate) {
      let promise: Promise<void> | undefined
      for (let square = this._squares.pop(); square; square = this._squares.pop()) {
        promise = square.destroy(true)
        await wait(50)
      }
      await promise
    }
    this.removeClass('grid--no-interaction')
    this.remove()
  }
}

export { Grid, GridProperties }
