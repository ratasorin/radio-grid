import './Square.css'

import { Component } from '../internal/Component'
import { isDefined } from '../util'

type SquareEventListener<K extends keyof HTMLElementEventMap> = (this: Square, event: HTMLElementEventMap[K]) => void

type SquareEventListeners = {
  [key in keyof HTMLElementEventMap]?: SquareEventListener<key>
}

interface SquareProperties {
  color: string
  eventListeners?: SquareEventListeners
}

class Square extends Component<HTMLDivElement> {
  private userEvents: SquareEventListeners = {}

  constructor(properties: SquareProperties) {
    super({ tag: 'div', classList: ['grid__square'] })
    ;({ color: this.color } = properties)
    if (isDefined(properties.eventListeners)) {
      const events = properties.eventListeners
      ;(Object.keys(events) as (keyof SquareEventListeners)[])
        .filter((key) => isDefined(events[key]))
        .forEach((key) => {
          this.userEvents[key] = (events[key] as SquareEventListener<typeof key>).bind(this)
          this.addEventListener(key, this.userEvents[key] as SquareEventListener<typeof key>)
        })
    }
    this.addEventListener('mouseenter', () => {
      this.setStyle('z-index', `${2}`)
    })
    this.addEventListener('mouseleave', () => {
      const events: (keyof SquareEventListeners)[] = ['transitionend', 'transitioncancel']
      const transitionEventHandler = function (this: Square) {
        this.setStyle('z-index', '')
        events.forEach((event) => this.removeEventListener(event, transitionEventHandler))
      }.bind(this)
      this.setStyle('z-index', `${1}`)
      events.forEach((event) => this.addEventListener(event, transitionEventHandler))
    })
  }

  removeCustomEvent<K extends keyof SquareEventListeners>(event: K): void {
    if (isDefined(this.userEvents[event])) {
      this.removeEventListener(event, this.userEvents[event] as SquareEventListener<typeof event>)
    }
  }

  addCustomEvent<K extends keyof SquareEventListeners>(event: K, callback: SquareEventListener<K>): void {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(this.userEvents[event] as SquareEventListener<K>) = callback.bind(this)
    this.addEventListener(event, this.userEvents[event] as SquareEventListener<K>)
  }

  get color(): string {
    return this.getStyle('--color')
  }

  set color(color: string) {
    this.setStyle('--color', color)
  }

  async create<T extends HTMLElement>(parent: Component<T>, animate: boolean): Promise<void> {
    this.appendTo(parent)
    if (animate) {
      this.addClass('grid__square--inserted')
      await new Promise<void>((resolve) => {
        this.addEventListener('animationend', () => {
          this.removeClass('grid__square--inserted')
          resolve()
        })
      })
    }
  }

  async destroy(animate: boolean): Promise<void> {
    if (animate) {
      await new Promise<void>((resolve) => {
        this.addEventListener('animationend', () => resolve())
        this.addClass('grid__square--deleted')
      })
    }
    this.remove()
  }
}

export { Square, SquareProperties, SquareEventListeners, SquareEventListener }
