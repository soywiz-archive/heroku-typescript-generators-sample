/// <reference path="typings/node/node.d.ts" />
var fs = require('fs');

function handleFolder(folder) {
    fs.readdirSync(folder).forEach(function (fileName) {
        var fullPath = folder + '/' + fileName;
        if (fileName == 'node_modules')
            return;
        if (fileName.match(/\.js$/)) {
            var data = (fs.readFileSync(fullPath, 'utf-8'));
            var datamod = data;
            datamod = datamod.replace(/Q\.(async|spawn)\s*\(\s*function\s*\(/g, 'Q.$1(function*(');
            if (data != datamod) {
                fs.writeFileSync(fullPath, datamod, 'utf-8');
                console.log('Fixed generators in "' + fullPath + '"');
            }
        }
        if (fs.lstatSync(fullPath).isDirectory())
            handleFolder(fullPath);
    });
}

handleFolder('.');
//# sourceMappingURL=updateasync.js.map
