﻿/// <reference path="typings/node/node.d.ts" />

import fs = require('fs');

function handleFolder(folder) {
    fs.readdirSync(folder).forEach((fileName) => {
        var fullPath = folder + '/' + fileName;
        if (fileName == 'node_modules') return;
        if (fileName.match(/\.js$/)) {
            var data = <string><any>(fs.readFileSync(fullPath, 'utf-8'));
            var datamod = data.replace(/Q.spawn\s*\(\s*function\s*\(/g, 'Q.spawn(function*(');
            if (data != datamod) {
                fs.writeFileSync(fullPath, datamod, 'utf-8');
                console.log('Fixed generators in "' + fullPath + '"');
            }
        }
        if (fs.lstatSync(fullPath).isDirectory()) handleFolder(fullPath);
    });
}

handleFolder('.');