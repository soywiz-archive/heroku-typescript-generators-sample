/// <reference path="../typings/_typings.d.ts" />
var Q = require('q');
var mongodb = require('mongodb');

var DbAsync = (function () {
    function DbAsync(db) {
        this.db = db;
    }
    //connectAsync() {
    //}
    DbAsync.prototype.collection = function (name) {
        return new CollectionAsync(this.db, name, this.db.collection(name));
    };
    return DbAsync;
})();
exports.DbAsync = DbAsync;

var CollectionAsync = (function () {
    function CollectionAsync(db, name, collection) {
        this.db = db;
        this.name = name;
        this.collection = collection;
    }
    CollectionAsync.prototype.countAsync = function (query) {
        return Q.ninvoke(this.collection, 'count', query);
    };

    CollectionAsync.prototype.insertAsync = function (data) {
        return Q.ninvoke(this.collection, 'insert', data);
    };

    CollectionAsync.prototype.ensureIndexAsync = function (type, info) {
        return Q.ninvoke(this.collection, 'ensureIndex', type, info);
    };

    CollectionAsync.prototype.dropCollectionAsync = function () {
        return Q.ninvoke(this.db, 'dropCollection', this.name);
    };

    // find({"$text":{"$search":"test"}},{"score":{"$meta":"textScore"}}).sort({"score":{"$meta":"textScore"}}).limit(10)
    CollectionAsync.prototype.find = function (selector) {
        return new CursorAsync(this.collection.find(selector));
    };
    return CollectionAsync;
})();
exports.CollectionAsync = CollectionAsync;

var CursorAsync = (function () {
    function CursorAsync(cursor) {
        this.cursor = cursor;
    }
    CursorAsync.prototype.sort = function (keyOrList) {
        return new CursorAsync(this.cursor.sort(keyOrList));
    };

    CursorAsync.prototype.limit = function (count) {
        return new CursorAsync(this.cursor.limit(count));
    };

    CursorAsync.prototype.toArrayAsync = function () {
        return Q.ninvoke(this.cursor, 'toArray');
    };
    return CursorAsync;
})();
exports.CursorAsync = CursorAsync;

function connectAsync(host, port, dbName, user, password) {
    var defer = Q.defer();
    var safe = true;
    var mongoServer = new mongodb.Server(host, port, { auto_reconnect: true, safe: safe });
    var db = new mongodb.Db(dbName, mongoServer, { safe: safe });
    db.open(function (err, db) {
        if (err) {
            defer.reject(err);
        } else {
            if (user === undefined || password === undefined) {
                defer.resolve(db);
            } else {
                db.authenticate(user, password, function (err, result) {
                    if (err) {
                        defer.reject(err);
                    } else {
                        defer.resolve(db);
                    }
                });
            }
        }
    });
    return defer.promise;
}
exports.connectAsync = connectAsync;
/*
export function toArrayAsync(cursor: mongodb.Cursor): Q.Promise<any[]> {
return Q.ninvoke<any[]>(cursor, 'toArray');
}
export function insertAsync(collection: mongodb.Collection, data: any): Q.Promise<any> {
return Q.ninvoke(collection, 'insert', data);
}
export function ensureIndexAsync(collection: mongodb.Collection, type: any, info: any): Q.Promise<any> {
return Q.ninvoke(collection, 'ensureIndex', type, info);
}
*/
//# sourceMappingURL=mymongodb.js.map
