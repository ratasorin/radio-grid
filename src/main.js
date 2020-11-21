'use strict'

const generateArray = (length, generatorFunc) => Array.apply(null, Array(length)).map(generatorFunc)

const randInt = (limit) => Math.floor(Math.random() * limit)

const generateColors = () => {
  return generateArray(10, (elem, index) =>
    getComputedStyle(document.querySelector(':root')).getPropertyValue(`--color-${index}`)
  )
}

const getSquareSideLength = (viewportWidth, viewportHeight) => {
  if (viewportHeight === 0) {
    return viewportWidth
  }
  return getSquareSideLength(viewportHeight, viewportWidth % viewportHeight)
}

const createSquare = (sideLength, colors) => {
  const square = document.createElement('div')
  square.classList.add('grid__square')
  square.style.setProperty('--side-length', `${sideLength}px`)
  square.style.setProperty('--color', `${colors}`)
  return square
}

const generateSquares = (count, sideLength, colorCombinations) => {
  const colorCount = colorCombinations.length
  return generateArray(count, () => createSquare(sideLength, colorCombinations[randInt(colorCount)]))
}

const appendElements = (parent, elements) => {
  elements.forEach((elem) => parent.appendChild(elem))
}

window.addEventListener('load', () => {
  const width = screen.width
  const height = screen.height
  const squareSideLength = getSquareSideLength(width, height) * 2
  const squareCount = Math.floor((width / squareSideLength) * (height / squareSideLength))
  const grid = document.querySelector('.grid')
  grid.style.setProperty('--count', `${width / squareSideLength}`)
  grid.style.setProperty('--size', `${squareSideLength}px`)
  const squares = generateSquares(squareCount, squareSideLength, generateColors())
  appendElements(grid, squares)
})
