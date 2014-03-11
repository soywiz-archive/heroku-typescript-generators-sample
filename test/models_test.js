/// <reference path="../typings/_test.d.ts" />
var assert = require('assert');

var Q = require('q');
var db = require('../models/db');
var user = require('../models/user');

describe('models', function () {
    before(function (done) {
        Q.spawn(function*() {
            yield(db.connectAsync('127.0.0.1', 27017, 'soywiz_test'));
            done();
        });
    });

    describe('users', function () {
        before(function (done) {
            Q.spawn(function*() {
                yield(db.dbAsync.collection('users').dropCollectionAsync());
                yield(user.users.initializeAsync());
                done();
            });
        });
        it('should create user', function (done) {
            Q.spawn(function*() {
                var result;
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
//# sourceMappingURL=models_test.js.map
