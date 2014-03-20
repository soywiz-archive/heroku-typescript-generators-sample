/// <reference path="../typings/_typings.d.ts" />
var _db = require('./db');
var crypto = require('crypto');

var Users = (function () {
    function Users() {
    }
    Object.defineProperty(Users.prototype, "collection", {
        get: function () {
            return _db.dbAsync.collection('users');
        },
        enumerable: true,
        configurable: true
    });

    Users.prototype.saveAsync = function (user) {
        return this.collection.insertAsync(user.createObject());
    };

    Users.prototype.checkLoginAsync = function (name, password) {
        return this.collection.countAsync(new User(name, password).createLoginObject()).then(function (count) {
            return count > 0;
        });
    };

    Users.prototype.initializeAsync = function () {
        return this.collection.ensureIndexAsync({ name: 1 }, { unique: true, dropDups: true });
    };
    return Users;
})();
exports.Users = Users;

var User = (function () {
    function User(name, password) {
        this.name = name;
        this.passwordHash = User.hash(password);
    }
    User.prototype.createLoginObject = function () {
        return { name: this.name, passwordHash: this.passwordHash };
    };

    User.prototype.createObject = function () {
        return { name: this.name, passwordHash: this.passwordHash };
    };

    User.hash = function (password) {
        return crypto.createHash('md5').update(password + '-user2014').digest('hex');
    };
    return User;
})();
exports.User = User;

exports.users = new Users();
//# sourceMappingURL=user.js.map
