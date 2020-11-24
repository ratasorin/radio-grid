import './Square.css'

export interface SquareProperties {
  color: string
}

export default class Square {
  private readonly element = document.createElement('div')

  constructor(properties: SquareProperties) {
    ;({ color: this.color } = properties)
    this.element.classList.add('grid__square')
  }

  get color(): string {
    return this.element.style.getPropertyValue('--color')
  }
  set color(color: string) {
    this.element.style.setProperty('--color', color)
  }

  appendTo(parent: Node) {
    parent.appendChild(this.element)
  }
  destroy() {
    this.element.remove()
  }
}
