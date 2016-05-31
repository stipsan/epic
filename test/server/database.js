import * as database from '../../src/server/database'

import expect from 'expect'
import Redis from 'ioredis'

import testRedis from '../testRedis'

const successCredentials = { email: 'bruce@wayne.enterprises', password: 'batman' }
const successAuthToken = {
  id: '3',
  email: successCredentials.email,
  username: 'batman',
  privateChannel: 'user:3'
}
const failureCredentials = { username: 'wonderwoman' }

describe('server/database', () => {
  it('authenticate', () => {
    return database.authenticate(successCredentials, testRedis)
      .then(authToken => {
        expect(authToken).toEqual(successAuthToken)
      })
  })

  it('getViewer', () => {
    return database.getViewer(successAuthToken, testRedis)
      .then(viewer => {
        expect(viewer).toEqual({
          friendIds: ['2', '4', '5'],
          invites: ['4', '5'],
          games: []
        })
      })
  })

  it('getFriends', () => {
    return database.getFriends({
      id: successAuthToken.id,
      friends: ['2', '4', '5'],
      invites: ['4', '5']
    }, testRedis)
      .then(friends => {
        expect(friends).toEqual([
          {
            id: '2',
            username: 'superman',
            inviteIn: false,
            inviteOut: false,
            online: '1',
            email: 'clark@daily.planet',
          },
          {
            id: '4',
            username: 'spiderman',
            inviteIn: true,
            inviteOut: false,
            online: '0',
            email: 'peter.parker@dailybugle.com',
          },
          {
            id: '5',
            username: 'lex',
            inviteIn: true,
            inviteOut: true,
            online: '0',
            lastVisit: '2016-03-22T00:15:46.757Z',
            email: 'lex@lex.corp',
          }
        ])
      })
  })

  it('createUser', () => {
    return database.createUser({
      username: 'logan',
      email: 'wolverine@xmen.org',
      password: 'hustlergottahustle',
    }, testRedis)
      .then(user => {
        expect(user).toEqual({
          id: '6',
          username: 'logan',
          email: 'wolverine@xmen.org',
          privateChannel: 'user:6'
        })
      })
  })

  it('setViewerOffline', () => {
    const lastVisit = new Date().toJSON()
    return database.setViewerOffline(successAuthToken, lastVisit, testRedis)
      .then(user => {
        expect(user).toEqual({
          id: '3',
          online: '0',
          lastVisit
        })
      })
  })

  it('viewerSendsInvite', () => {
    const friendId = 2
    return database.viewerSendsInvite(successAuthToken, friendId, testRedis)
      .then(friend => {
        expect(friend).toEqual({
          id: friendId,
          inviteOut: true
        })
      })
  })

  it('viewerCancelsInvite', () => {
    const friendId = 2
    return database.viewerCancelsInvite(successAuthToken, friendId, testRedis)
      .then(friend => {
        expect(friend).toEqual({
          id: friendId,
          inviteOut: false
        })
      })
  })

  it('viewerAcceptsInvite', () => {
    const friendId = 4
    return database.viewerAcceptsInvite(successAuthToken, friendId, testRedis)
      .then(friend => {
        expect(friend).toEqual({
          id: friendId,
          inviteOut: true
        })
      })
  })

  it('viewerDeclinesInvite', () => {
    const friendId = 5
    return database.viewerDeclinesInvite(successAuthToken, friendId, testRedis)
      .then(friend => {
        expect(friend).toEqual({
          id: friendId,
          inviteIn: false
        })
      })
  })

  it('newGame')
  it('loadGame')
  it('joinGame')
  it('saveTurn')
  it('getGames')
  it('getUser')
})