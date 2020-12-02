import path from 'path'

export default {
  roots: [path.resolve(path.resolve(), 'src')],
  testMatch: ['**/__tests__/**/*.+(ts)', '**/?(*.)+(spec|test).+(ts)'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
  },
}
