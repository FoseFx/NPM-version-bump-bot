// You can import your modules
// import index from '../src/index'

import nock from 'nock'
// Requiring our app implementation
import myProbotApp from '../src'
import { Probot, Context } from 'probot'
// Requiring our fixtures
import payload from './fixtures/push.json'
import payloadNoCare from './fixtures/pushnc.json'
import validPackageJson from './fixtures/valid-package.json'
import validPackageJsonResp from './fixtures/valid-package-resp.json'
import { shouldCare, getConfig } from '../src/util'

nock.disableNetConnect()

describe('Version Bump Bot', () => {
  let probot: any

  beforeEach(() => {
    probot = new Probot({ id: 123, cert: 'test' })
    // Load our app into probot
    const app = probot.load(myProbotApp)

    // just return a test token
    app.app = () => 'test'
  })

  describe('shouldCare', () => {
    test('should care about "[skip travis] Bumped Version to 123.123.123"', () => {
      const ctx = { payload: { head_commit: { message: '[skip travis] Bumped Version to 123.123.123' } } }
      // @ts-ignore
      expect(shouldCare(ctx)).toBe(true)
    })
    test('should care about "Bumped Version to123.123.123"', () => {
      const ctx = { payload: { head_commit: { message: 'Bumped Version to123.123.123' } } }
      // @ts-ignore
      expect(shouldCare(ctx)).toBe(true)
    })
    test('should not care about "Bumped Versionto123.123.123"', () => {
      const ctx = { payload: { head_commit: { message: 'Bumped Versionto123.123.123' } } }
      // @ts-ignore
      expect(shouldCare(ctx)).toBe(false)
    })
    test('should not care about "bumped version to 123.123.123"', () => {
      const ctx = { payload: { head_commit: { message: 'bumped version to 123.123.123' } } }
      // @ts-ignore
      expect(shouldCare(ctx)).toBe(false)
    })
  })

  describe('on push', () => {
    describe('should care', () => {
      test('valid package.json', async (done) => {
        nock('https://api.github.com')
          .post('/app/installations/1248732/access_tokens')
          .reply(200, { token: 'test' })

        nock('https://api.github.com')
          .get('/repos/FoseFx/test-repo/contents/.github/config.yml')
          .reply(404)

        nock('https://api.github.com')
          .get('/repos/FoseFx/test-repo/contents/package.json?ref=refs%2Fheads%2Fmaster')
          .reply(200, validPackageJson)

        nock('https://api.github.com')
          .put('/repos/FoseFx/test-repo/contents/package.json', (body: any) => {
            expect(body).toEqual(validPackageJsonResp)
            done()
          })
          .reply(200)

        await probot.receive({ name: 'push', payload })
      })
    })
  })
})

// For more information about testing with Jest see:
// https://facebook.github.io/jest/

// For more information about using TypeScript in your tests, Jest recommends:
// https://github.com/kulshekhar/ts-jest

// For more information about testing with Nock see:
// https://github.com/nock/nock

/*
  test('creates a comment when an issue is opened', async (done) => {
    // Test that we correctly return a test token
    nock('https://api.github.com')
      .post('/app/installations/2/access_tokens')
      .reply(200, { token: 'test' })

    // Test that a comment is posted
    nock('https://api.github.com')
      .post('/repos/hiimbex/testing-things/issues/1/comments', (body: any) => {
        done(expect(body).toMatchObject(issueCreatedBody))
        return true
      })
      .reply(200)

    // Receive a webhook event
    await probot.receive({ name: 'issues', payload })
  })
  */
