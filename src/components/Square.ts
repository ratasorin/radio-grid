import './Square.css'

type SquareEventListener = (square: Square, event: Event) => void

type SquareEventListeners = {
  [key: string]: SquareEventListener
}

interface SquareProperties {
  color: string
  eventListeners?: SquareEventListeners
}

class Square {
  private readonly element = document.createElement('div')

  constructor(properties: SquareProperties) {
    this.color = properties.color
    this.element.classList.add('grid__square')
    const events = properties.eventListeners
    for (const event in events) {
      if (Object.prototype.hasOwnProperty.call(events, event)) {
        const callback = events[event]
        this.element.addEventListener(event, (ev) => callback(this, ev))
      }
    }
  }

  get color(): string {
    return this.element.style.getPropertyValue('--color')
  }

  set color(color: string) {
    this.element.style.setProperty('--color', color)
  }

  async appendTo(parent: Node, animate: boolean): Promise<void> {
    parent.appendChild(this.element)
    if (animate) {
      this.element.classList.add('grid__square--inserted')
      await new Promise<void>((resolve) => {
        this.element.addEventListener('animationend', () => {
          this.element.classList.remove('grid__square--inserted')
          resolve()
        })
      })
    }
  }

  async destroy(animate: boolean): Promise<void> {
    if (animate) {
      await new Promise<void>((resolve) => {
        this.element.addEventListener('animationend', () => resolve())
        this.element.classList.add('grid__square--deleted')
      })
    }
    this.element.remove()
  }
}

export { Square, SquareProperties, SquareEventListeners, SquareEventListener }
