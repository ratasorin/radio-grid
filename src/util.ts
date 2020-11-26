export const generateArray = <T>(length: number, generatorFunc: (elem: T, index: number, array: T[]) => T): T[] =>
  new Array(length).fill(null).map(generatorFunc)

export const randInt = (limit: number): number => Math.floor(Math.random() * limit)

export const appendElements = <T>(parent: Element, elements: T[], elemRetrievalFunc = (elem: T | Node) => elem as Node): void => {
  elements.forEach((elem) => parent.appendChild(elemRetrievalFunc(elem)))
}

export const GCD = (a: number, b: number): number => {
  if (b === 0) {
    return a
  }
  return GCD(b, a % b)
}
