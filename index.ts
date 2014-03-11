/// <reference path="typings/_typings.d.ts" />

import http = require('http');
import atpl = require('atpl');
import mongodb = require('mongodb');
var connect = require('connect');
import fs = require('fs');
import Q = require('q');
import _ = require('underscore');
import urlrouter = require('urlrouter');
import websocket = require('websocket');

import db = require('./models/db');
import mymongodb = require('./models/mymongodb');

function readFileAsync(name: string): Q.Promise<string> {
    return Q.nfcall<string>(fs.readFile, name, "utf-8");
}

function atplAsync(name: string, args: any): Q.Promise<string> {
    return Q.nfcall<string>(atpl.__express, name, _.extend({}, { settings: { views: __dirname + '/views' }, cache: true }, args));
}

var port = process.env.PORT || 80;

var app = connect()
//.use(connect.logger('dev'))
    .use(connect.query())
    .use(connect.urlencoded())
    .use(urlrouter((app) => {
        app.get('/', (req, res) => {
            res.writeHead(307, { 'Location': '/test' });
            res.end();
        });
        app.post('/test', (req, res) => {
            Q.spawn(() => {
                try {
                    var body = req['body'];
                    yield(db.dbAsync.collection('testcollection').insertAsync({ 'type': body.type }));
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end('<script type="text/javascript">document.location = "/test?redirected";</script>');
                } catch (e) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('error: ' + e);
                }
            });
        });
        app.get('/test', (req, res) => {
            Q.spawn(() => {
                try {
                    var timer = new Timer();
                    var items = yield(db.dbAsync.collection('testcollection').find().sort({ type: +1 }).toArrayAsync());
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(yield(atplAsync('list.html', { items: items, time: timer.elapsed })));
                } catch (e) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('error: ' + e);
                }
            });
        });
    }))
    .use(connect.static('public'))
;

function readdirAsync(path: string) {
    var defer = Q.defer<string[]>();
    fs.readdir(path, (err, files) => {
        if (err) defer.reject(err); else defer.resolve(files);
    });
    return defer.promise;
}

var server = http.createServer(app);

var wsServer = new websocket.server({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    console.log('originIsAllowed:' + origin);
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    try {
        var connection = request.accept('echo-protocol', request.origin);
        console.log((new Date()) + ' Connection accepted.');
        connection.on('message', (message) => {
            if (message.type === 'utf8') {
                console.log('Received Message: ' + message.utf8Data);
                connection.sendUTF(message.utf8Data);
            }
            else if (message.type === 'binary') {
                console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
                connection.sendBytes(message.binaryData);
            }
        });
        connection.on('close', (reasonCode, description) => {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });
    } catch (e) {
        console.log(e);
    }
});

class Timer {
    start: number;

    constructor() {
        this.start = new Date().getTime();
    }

    get elapsed() {
        return new Date().getTime() - this.start;
    }
}

Q.spawn(() => {
    yield(db.connectAsync('troup.mongohq.com', 10014, 'soywiz_test', 'testtest', 'testtest'));

    server.listen(port);
    console.log('listening to: ' + port);
});
