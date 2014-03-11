/// <reference path="../typings/_typings.d.ts" />

import Q = require('q');
import mongodb = require('mongodb');
import mymongodb = require('./mymongodb');

export var db: mongodb.Db;
export var dbAsync: mymongodb.DbAsync;

export function connectAsync(host: string, port: number, dbName: string, user?: string, password?: string) {
    var defer = Q.defer();
    mymongodb.connectAsync(host, port, dbName, user, password).then((_db) => {
        db = _db;
        dbAsync = new mymongodb.DbAsync(db);
        defer.resolve(true);
    });
    return defer.promise;
}
