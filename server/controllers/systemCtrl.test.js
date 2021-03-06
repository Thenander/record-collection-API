// Test data
//
const applicationPaths = {
  system: {
    monitor: {
      uri: '/_monitor',
    },
    robots: {
      uri: '/robots.txt',
    },
  },
}

// Mock functions

jest.mock('../server', () => {
  return {
    getPaths: jest.fn().mockImplementation(() => {
      return {
        system: {
          monitor: {
            uri: '/_monitor',
          },
          robots: {
            uri: '/robots.txt',
          },
        },
      }
    }),
  }
})

jest.mock('kth-node-express-routing', () => {
  return {
    getPaths: jest.fn().mockImplementation(() => {
      return {
        system: {
          monitor: {
            uri: '/_monitor',
          },
          robots: {
            uri: '/robots.txt',
          },
        },
      }
    }),
  }
})

jest.mock('component-registry', () => {
  return {
    globalRegistry: {
      getUtility: jest.fn().mockImplementation(() => {
        return {
          status: jest.fn(() => {
            return { statusCode: 200 }
          }),
          renderJSON: jest.fn(() => '{status:200}'),
        }
      }),
    },
  }
})

/*
 * utility functions
 */
function buildReq(overrides) {
  const req = { headers: { accept: 'application/json' }, body: {}, params: {}, ...overrides }
  return req
}

function buildRes(overrides = {}) {
  const res = {
    json: jest
      .fn(() => {
        return res
      })
      .mockName('json'),
    status: jest.fn(() => res).mockName('status'),
    type: jest.fn(() => res).mockName('type'),
    send: jest.fn(() => res).mockName('send'),
    render: jest.fn(() => res).mockName('render'),

    ...overrides,
  }
  return res
}

function buildNext(impl) {
  return jest.fn(impl).mockName('next')
}

describe(`System controller`, () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
    jest.clearAllMocks()
  })
  afterEach(() => {
    process.env = OLD_ENV
  })

  test('monitor returns successfully when using component registry', async () => {
    const req = buildReq({})
    const res = buildRes()

    jest.mock('kth-node-monitor', () => {
      return {
        interfaces: jest.fn(),
      }
    })

    const { monitor } = require('./systemCtrl')

    await monitor(req, res)
    expect(res.status).toHaveBeenNthCalledWith(1, 200)
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  test('about returns successfully', async () => {
    const req = buildReq({})
    const res = buildRes()

    const { about } = require('./systemCtrl')

    await about(req, res)
    expect(res.render).toHaveBeenCalledTimes(1)
  })

  test('robotsTxt returns successfully', async () => {
    const req = buildReq({})
    const res = buildRes()

    const { robotsTxt } = require('./systemCtrl')

    await robotsTxt(req, res)

    expect(res.render).toHaveBeenCalledTimes(1)
    expect(res.type).toHaveBeenNthCalledWith(1, 'text')
  })

  test('paths returns successfully', async () => {
    const req = buildReq({})
    const res = buildRes()

    const { paths } = require('./systemCtrl')

    await paths(req, res)

    expect(res.json).toHaveBeenNthCalledWith(1, applicationPaths)
  })
})
