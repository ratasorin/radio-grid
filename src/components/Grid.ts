import { Square, SquareEventListeners } from './Square'
import { generateArray, randInt } from '../util'

import './Grid.css'
import ResizeObserver from 'resize-observer-polyfill'

interface GridProperties {
  colors: string[]
  squareCount: number
  squareEventListeners?: SquareEventListeners
}

const generateSquares = (startID: number, props: GridProperties) =>
  generateArray<Square>(
    props.squareCount,
    (_, i) =>
      new Square({
        id: startID + i,
        color: props.colors[randInt(props.colors.length)],
        eventListeners: props.squareEventListeners,
      })
  )

class Grid {
  private readonly element = document.createElement('div')
  private readonly properties: GridProperties
  private squares: Square[] = []
  private readonly mutationObserver: MutationObserver
  private readonly resizeObserver: ResizeObserver

  constructor(properties: GridProperties) {
    this.properties = properties
    this.element.classList.add('grid')
    this.resizeObserver = new ResizeObserver(() => {
      const { sideLength } = this.getSquareData()
      this.squareSideLength = sideLength
    })
    this.mutationObserver = new MutationObserver((mutations) => {
      mutations
        .filter((mut) => !mut.target.isConnected)
        .map((mut) => parseInt(mut.oldValue as string, 10))
        .forEach((index) => {
          this.squares.splice(index, 1)
          for (let i = index; i < this.squares.length; i++) {
            this.squares[i].id = i
          }
        })
    })
  }

  get currentSquareCount(): number {
    return this.squares.length
  }

  private getWidth(): number {
    return parseInt(window.getComputedStyle(this.element).width, 10)
  }

  private getHeight(): number {
    return parseInt(window.getComputedStyle(this.element).height, 10)
  }

  private get squareSideLength(): number {
    return parseInt(this.element.style.getPropertyValue('--size'), 10)
  }

  private set squareSideLength(squareSideLength: number) {
    this.element.style.setProperty('--size', `${squareSideLength}px`)
  }

  private async appendSquares(squares: Square[], animate: boolean): Promise<void> {
    if (animate) {
      await new Promise<void>((resolve) => {
        const it = squares.values()
        let promise: Promise<void> | undefined
        const interval = setInterval(() => {
          const square = it.next()
          if (square.done) {
            clearInterval(interval)
            promise?.then(resolve)
            return
          }
          promise = square.value.appendTo(this.element, true)
        }, 50)
      })
    } else {
      for (const square of squares) {
        square.appendTo(this.element, false)
      }
    }
  }

  private getSquareData() {
    const count = this.properties.squareCount
    const width = this.getWidth()
    const height = this.getHeight()
    const [row, column] = [Math.max(width, height), Math.min(width, height)]
    const sideLength = Math.sqrt((row * column) / count)
    console.log(sideLength)
    return { sideLength }
  }

  async appendTo(parent: Node, animate: boolean): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    parent.appendChild(this.element)
    const { sideLength } = this.getSquareData()
    this.squareSideLength = sideLength
    this.squares = generateSquares(0, this.properties)
    this.element.classList.add('grid--no-interaction')
    await this.appendSquares(this.squares, animate)
    this.mutationObserver.observe(this.element, {
      attributes: true,
      subtree: true,
      attributeFilter: ['data-id'],
      attributeOldValue: true,
    })
    this.resizeObserver.observe(this.element)
    this.element.classList.remove('grid--no-interaction')
  }

  async destroy(animate: boolean): Promise<void> {
    this.mutationObserver.disconnect()
    this.element.classList.add('grid--no-interaction')
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
    this.element.classList.remove('grid--no-interaction')
    this.element.remove()
  }
}

export { Grid, GridProperties }
