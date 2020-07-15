const { getData, postData } = require('./sampleCtrl')

// Test data
//

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

jest.mock('../models', () => {
  return {
    Sample: {
      findById: jest.fn().mockImplementation(_id => {
        if (!_id || _id === 'abc') return null
        if (_id === 'fail')
          return {
            _id,
            name: 'mockdata',
            save: jest.fn().mockImplementation(() => {
              throw new Error('Failed to save')
            }),
          }
        return {
          _id,
          name: 'mockdata',
          save: jest.fn().mockImplementation(() => {}),
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

describe(`Sample controller`, () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
    jest.clearAllMocks()
  })
  afterEach(() => {
    process.env = OLD_ENV
  })

  test('should getData ok', async () => {
    const req = buildReq({ params: { id: '123' } })
    const res = buildRes()
    const next = buildNext()

    await getData(req, res, next)

    expect(res.json).toHaveBeenNthCalledWith(1, { id: '123', name: 'mockdata' })
  })

  test('should handle getData not found', async () => {
    const req = buildReq({})
    const res = buildRes()
    const next = buildNext()

    await getData(req, res, next)

    expect(next).toHaveBeenNthCalledWith(1)
  })

  test('should postData update ok', async () => {
    const req = buildReq({ params: { id: '123' }, body: { name: 'foo' } })
    const res = buildRes()
    const next = buildNext()

    await postData(req, res, next)
    expect(res.json).toHaveBeenNthCalledWith(1, { id: '123', name: 'foo' })
  })
  test('should postData create ok', async () => {
    const req = buildReq({ params: { id: '123' }, body: { name: 'foo' } })
    const res = buildRes()
    const next = buildNext()

    await postData(req, res, next)
    expect(res.json).toHaveBeenNthCalledWith(1, { id: '123', name: 'foo' })
  })
  test('should handle postData  fail', async () => {
    const req = buildReq({ params: { id: 'fail' }, body: { name: 'foo' } })
    const res = buildRes()
    const next = buildNext()

    await postData(req, res, next)
    expect(next).toHaveBeenNthCalledWith(1, new Error('Failed to save'))
  })
})
