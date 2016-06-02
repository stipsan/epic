/* eslint strict: ["off"]*/
'use strict'

const path = require('path')
const SocketCluster = require('socketcluster').SocketCluster

// running the migration right away, so the server don't start serving until we're ready
require('../migrate')

/* eslint no-new: "off"*/
new SocketCluster({
  workers: Number(process.env.WEB_CONCURRENCY) || 1,
  port: process.env.PORT || 5000,
  wsEngine: 'uws',
  allowClientPublish: false,
  workerController: path.resolve(__dirname, 'worker.js'),
  // Using babel transpiling instead of babel-register, for performance
  initController: 'production' !== process.env.NODE_ENV && path.resolve(__dirname, 'init.js'),
  logLevel: process.env.LOG_LEVEL ? Number(process.env.LOG_LEVEL) : 3,
  authKey: process.env.AUTH_KEY,
  origins: process.env.ORIGINS || '*:*',
})
