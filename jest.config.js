module.exports = {
  ...require('./test/jest-common'),
  projects: ['./test/jest.server.js'],
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/', '/unit/'],
}
