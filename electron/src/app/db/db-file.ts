import fs = require('fs');
import path = require('path');
import electron = require('electron');

let app = electron.app || electron.remote.app;
let userData = app.getPath('userData');

let getFileName = function(key) {
    if (!key) {
        throw new Error('Missing key');
    }

    if (typeof key !== 'string' || key.trim().length === 0) {
        throw new Error('Invalid key');
    }

    const keyFileName = path.basename(key.trim(), '.json') + '.json';

    return path.join(userData, keyFileName);
};

let readFileAsync = function(fileName: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, { encoding: 'utf8' }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

let writeFileAsync = function(fileName: string, content: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, content, 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(null);
            }
        });
    })
};

export function loadDBAsync(key: string, default_value: any): Promise<any> {
    return new Promise((resolve, reject) => {
        readFileAsync(getFileName(key))
        .then(function (res) {
            resolve(JSON.parse(res));
        }).catch(function (err) {
            if (err.code === 'ENOENT') {
                resolve(default_value);
            } else {
                reject(err);
            }
        });
    });
};

export function saveDBAsync(key: string, content: any): Promise<any> {
    return new Promise((resolve, reject) => {
        writeFileAsync(getFileName(key), JSON.stringify(content)).then(function (res) {
            resolve(res);
        });
    });
};

/*
export let API = {
    getArray: function(key: string): Promise<any> {
        return loadDBAsync(key, []);
    },

    addToArray: function(key: string, value: any): Promise<any> {
        return loadDBAsync(key, []).then(function (data) {
            data.push(value);
            return saveDBAsync(key, data);
        });
    },

    removeFromArray: function(key: string, filter: Function): Promise<any> {
        return loadDBAsync(key, []).then(function (data) {
            var new_data = [];
            data.forEach(function (d) {
                if (!filter(d)) {
                    new_data.push(d)
                }
            });
            return saveDBAsync(key, new_data);
        });
    }
}
*/
