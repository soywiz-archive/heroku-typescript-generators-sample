/// <reference path="../typings/_typings.d.ts" />

import Q = require('q');
import mongodb = require('mongodb');

export class DbAsync {
    constructor(private db: mongodb.Db) {
    }

    //connectAsync() {
    //}

    collection(name: string) {
        return new CollectionAsync(this.db, name, this.db.collection(name));
    }
}

export class CollectionAsync {
    constructor(private db: mongodb.Db, private name:string, private collection: mongodb.Collection) {
    }

    countAsync(query?: any) {
        return Q.ninvoke<number>(this.collection, 'count', query);
    }

    insertAsync(data: any) {
        return Q.ninvoke(this.collection, 'insert', data);
    }

    ensureIndexAsync(type: any, info: any) {
        return Q.ninvoke(this.collection, 'ensureIndex', type, info);
    }

    dropCollectionAsync() {
        return Q.ninvoke(this.db, 'dropCollection', this.name);
    }


    // find({"$text":{"$search":"test"}},{"score":{"$meta":"textScore"}}).sort({"score":{"$meta":"textScore"}}).limit(10)

    find(selector?: any) {
        return new CursorAsync(this.collection.find(selector));
    }
}

export class CursorAsync {
    constructor(private cursor: mongodb.Cursor) {
    }

    sort(keyOrList: any) {
        return new CursorAsync(this.cursor.sort(keyOrList));
    }

    limit(count: number) {
        return new CursorAsync(this.cursor.limit(count));
    }

    toArrayAsync() {
        return Q.ninvoke<any[]>(this.cursor, 'toArray');
    }
}

export function connectAsync(host: string, port: number, dbName: string, user?: string, password?: string) {
    var defer = Q.defer<mongodb.Db>();
    var safe = true;
    var mongoServer = new mongodb.Server(host, port, { auto_reconnect: true, safe: safe });
    var db = new mongodb.Db(dbName, mongoServer, { safe: safe });
    db.open((err, db) => {
        if (err) {
            defer.reject(err);
        } else {
            if (user === undefined || password === undefined) {
                defer.resolve(db);
            } else {
                db.authenticate(user, password, (err, result) => {
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
