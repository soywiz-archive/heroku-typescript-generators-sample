/// <reference path="../typings/_typings.d.ts" />

import Q = require('q');
import mymongodb = require('./mymongodb');
import mongodb = require('mongodb');
import _db = require('./db');
import crypto = require('crypto');

export class Users {
    private get collection() {
        return _db.dbAsync.collection('users');
    }

    saveAsync(user: User) {
        return this.collection.insertAsync(user.createObject());
    }

    checkLoginAsync(name: string, password: string) {
        return this.collection.countAsync(new User(name, password).createLoginObject()).then((count) => count > 0);
    }

    initializeAsync() {
        return this.collection.ensureIndexAsync({ name: 1 }, { unique: true, dropDups: true });
    }
}

export class User {
    name: string;
    passwordHash: string;

    constructor(name: string, password: string) {
        this.name = name;
        this.passwordHash = User.hash(password);
    }

    createLoginObject() {
        return { name: this.name, passwordHash: this.passwordHash };
    }

    createObject() {
        return { name: this.name, passwordHash: this.passwordHash };
    }

    static hash(password: string) {
        return crypto.createHash('md5').update(password + '-user2014').digest('hex');
    }
}

export var users: Users = new Users();
