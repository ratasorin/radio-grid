import debug from 'debug'

export const generateArray = <T>(length: number, generatorFunc: (elem: T, index: number, array: T[]) => T): T[] =>
  new Array(length).fill(null).map(generatorFunc)

export const randInt = (limit: number): number => Math.floor(Math.random() * limit)

export const isDefined = <T>(arg: T | undefined): arg is T => typeof arg !== 'undefined'

export class UnreachableError extends Error {
  constructor(x: never, message: string) {
    super(`TypeScript thought we could never end up here\n${message}`)
  }
}

export const wait = (time: number): Promise<void> => new Promise<void>((resolve) => setTimeout(resolve, time))

const log = debug('app:log')
if (process.env.ENVIRONMENT) {
  debug.enable('*')
  log('Logging is enabled!')
} else {
  debug.disable()
}

export { log }
