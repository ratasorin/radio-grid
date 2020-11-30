import './Grid.css'

import { Component } from '../internal/Component'
import { Square, SquareEventListener } from './Square'
import { generateArray, baseLog, randInt, wait } from '../util'
import ResizeObserver from 'resize-observer-polyfill'

interface GridProperties {
  colors?: string[]
  animationDelay?: number
  squareCount?: number
  squareEventListeners?: SquareEventListener[]
}

const log = baseLog.extend('Grid')

const generateSquares = (props: Required<GridProperties>) =>
  generateArray<Square>(
    props.squareCount,
    () =>
      new Square({
        color: props.colors[randInt(props.colors.length)],
        eventListeners: props.squareEventListeners,
      })
  )

const defaultProps: Required<GridProperties> = {
  colors: ['#000'],
  animationDelay: 50,
  squareCount: 48,
  squareEventListeners: [],
}

class Grid extends Component<HTMLDivElement> {
  private readonly properties: Required<GridProperties>
  private squares: Square[] = []
  private readonly resizeObserver: ResizeObserver

  constructor(properties: GridProperties) {
    super({ tag: 'div', classList: ['grid'] })
    this.properties = { ...defaultProps, ...properties }
    log('Grid properties: %O', this.properties)
    this.addClass('grid')
    this.resizeObserver = new ResizeObserver(() => {
      const { sideLength } = this.getSquareData()
      this.squareSideLength = sideLength
    })
  }

  setColors(colors: string[]): void {
    this.properties.colors = colors
    this.squares.forEach((square) => (square.color = colors[randInt(colors.length)]))
  }

  get squareCount(): number {
    return this.squares.length
  }

  removeSquare(square: Square): Square {
    const i = this.squares.indexOf(square)
    log('Square %d removed', i)
    return this.squares.splice(i, 1)[0]
  }

  async create<T extends HTMLElement>(parent: Component<T>, animate: boolean): Promise<void> {
    log('Creating grid')
    this.appendTo(parent)
    const { sideLength } = this.getSquareData()
    this.squareSideLength = sideLength
    this.addClass('grid--no-interaction')
    await this.appendSquares(generateSquares(this.properties), animate)
    this.resizeObserver.observe(this.element)
    this.removeClass('grid--no-interaction')
  }

  async destroy(animate: boolean): Promise<void> {
    log('Destroying grid')
    this.resizeObserver.disconnect()
    this.addClass('grid--no-interaction')
    if (animate) {
      let promise: Promise<void> | undefined
      for (let square = this.squares.pop(); square; square = this.squares.pop()) {
        promise = square.destroy(true)
        await wait(this.properties.animationDelay)
      }
      await promise
    }
    this.removeClass('grid--no-interaction')
    this.remove()
  }

  private getWidth(): number {
    return parseInt(this.getComputedStyle('width'))
  }

  private getHeight(): number {
    return parseInt(this.getComputedStyle('height'))
  }

  private get squareSideLength(): number {
    return parseInt(this.getStyle('--size'))
  }

  private set squareSideLength(squareSideLength: number) {
    this.setStyle('--size', `${squareSideLength}px`)
  }

  private async appendSquares(squares: Square[], animate: boolean): Promise<void> {
    let promise: Promise<void> | undefined
    this.squares.push(...squares)
    for (const square of squares) {
      promise = square.create(this, animate)
      if (animate) {
        await wait(this.properties.animationDelay)
      }
    }
    await promise
  }

  private getSquareData() {
    const count = this.properties.squareCount
    const width = this.getWidth()
    const height = this.getHeight()
    const sideLength = Math.sqrt((width * height) / count)
    return { sideLength }
  }
}

export { Grid, GridProperties }
