/// <reference path="../typings/_typings.d.ts" />
var Q = require('q');

var mymongodb = require('./mymongodb');

exports.db;
exports.dbAsync;

function connectAsync(host, port, dbName, user, password) {
    var defer = Q.defer();
    mymongodb.connectAsync(host, port, dbName, user, password).then(function (_db) {
        exports.db = _db;
        exports.dbAsync = new mymongodb.DbAsync(exports.db);
        defer.resolve(true);
    });
    return defer.promise;
}
exports.connectAsync = connectAsync;
//# sourceMappingURL=db.js.map
