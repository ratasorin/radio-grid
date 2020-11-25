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

  appendTo(parent: Node): void {
    parent.appendChild(this.element)
  }

  destroy(animate: boolean): Promise<void> {
    return new Promise<void>((resolve) => {
      const remove = () => {
        this.element.remove()
        resolve()
      }
      if (!this.element) {
        resolve()
        return
      }
      if (animate) {
        this.element.addEventListener('transitionend', remove)
        this.element.classList.add('grid__square--deleted')
      } else {
        remove()
      }
    })
  }
}

export { Square, SquareProperties, SquareEventListeners, SquareEventListener }
