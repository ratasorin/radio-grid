const generateArray = <T>(
  length: number,
  generatorFunc: (elem: T, index: number, array: T[]) => T
): T[] => new Array(length).fill(null).map(generatorFunc)

const randInt = (limit: number) => Math.floor(Math.random() * limit)

const appendElements = <T>(
  parent: Element,
  elements: T[],
  elemRetrievalFunc = (elem: T | Node) => elem as Node
) => {
  elements.forEach((elem) => parent.appendChild(elemRetrievalFunc(elem)))
}

const GCD = (a: number, b: number): number => {
  if (b === 0) {
    return a
  }
  return GCD(b, a % b)
}

export { generateArray, randInt, appendElements, GCD }
