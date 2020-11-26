import './Square.css'

type SquareEventListener = (square: Square, event: Event) => void

type SquareEventListeners = {
  [key: string]: SquareEventListener
}

interface SquareProperties {
  id?: number
  color: string
  eventListeners?: SquareEventListeners
}

class Square {
  private readonly element = document.createElement('div')
  private userEvents: {
    [key: string]: (ev: Event) => void
  } = {}

  constructor(properties: SquareProperties) {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    this.element.classList.add('grid__square')
    ;({ id: this.id, color: this.color } = properties)
    for (const event in properties.eventListeners) {
      if (Object.prototype.hasOwnProperty.call(properties.eventListeners, event)) {
        const callback = properties.eventListeners[event]
        this.addEventListener(event, callback)
      }
    }
    this.element.addEventListener('mouseenter', () => {
      this.element.style.zIndex = `${2}`
    })
    this.element.addEventListener('mouseleave', () => {
      const events = ['transitionend', 'transitioncancel']
      const transitionEventHandler = () => {
        this.element.style.zIndex = ''
        events.forEach((event) => this.element.removeEventListener(event, transitionEventHandler))
      }
      this.element.style.zIndex = `${1}`
      events.forEach((event) => this.element.addEventListener(event, transitionEventHandler))
    })
  }

  removeEventListener(event: string): void {
    if (Object.prototype.hasOwnProperty.call(this.userEvents, event)) {
      this.element.removeEventListener(event, this.userEvents[event])
    }
  }

  addEventListener(event: string, callback: SquareEventListener): void {
    const eventCallback = (ev: Event) => callback(this, ev)
    this.userEvents[event] = eventCallback
    this.element.addEventListener(event, eventCallback)
  }

  set id(value: number | undefined) {
    if (value != 0 && !value) {
      return
    }
    this.element.setAttribute('data-id', `${value}`)
  }

  get id(): number | undefined {
    const id = this.element.getAttribute('data-id')
    if (id) {
      return parseInt(id, 10)
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
    this.element.setAttribute('data-id', `${-1}`)
    this.element.remove()
  }
}

export { Square, SquareProperties, SquareEventListeners, SquareEventListener }
