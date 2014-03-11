﻿/// <reference path="../typings/_test.d.ts" />

import assert = require('assert');

import Q = require('q');
import db = require('../models/db');
import user = require('../models/user');

describe('models', () => {
    before((done: () => void) => {
        Q.spawn(() => {
            yield(db.connectAsync('127.0.0.1', 27017, 'soywiz_test'));
            done();
        });
    });

    describe('users', () => {
        before((done: () => void) => {
            Q.spawn(() => {
                yield(db.dbAsync.collection('users').dropCollectionAsync());
                yield(user.users.initializeAsync());
                done();
            });
        });
        it('should create user', (done: () => void) => {
            Q.spawn(() => {
                var result: boolean;
                yield(user.users.saveAsync(new user.User('test', 'test')));
                result = yield(user.users.checkLoginAsync('test', 'test'));
                assert.equal(true, result);
                result = yield(user.users.checkLoginAsync('test', 'test2'));
                assert.equal(false, result);
                result = yield(user.users.checkLoginAsync('test2', 'test'));
                assert.equal(false, result);
                done();
            });
        });
    });
});
