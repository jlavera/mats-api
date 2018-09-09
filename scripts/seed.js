#!/usr/bin/env node

'use strict';

const _         = require('lodash');
const Promise   = require('bluebird');
const container = require('../src/containerFactory').createContainer();
const mongoDb   = container.get('mongoDb');

const tree  = require('./info/tree');
const users = require('./info/users');

Promise.resolve()

  // Clean
  .then(() => mongoDb.run(db => db.collection('careers').remove({})))
  .then(() => mongoDb.run(db => db.collection('users').remove({})))

  // Create indexes
  .then(() => mongoDb.run(db => db.collection('careers').createIndex({ 'courses.code': 1 })))
  .then(() => mongoDb.run(db => db.collection('users').createIndex({ code: 1 })))

  // Inserts
  .then(() => mongoDb.run(db => db.collection('careers').insert(tree)))
  .then(() => console.log('Done careers'))

  .then(() => mongoDb.run(db => db.collection('users').insert(users)))
  .then(() => console.log('Done users'))

  .then(() => {
    console.log('OK');
    process.exit(0);
  })
  .catch(error => {
    console.log('ER', error);
    console.log(error.stack);
    process.exit(1);
  })
;
