//import { loadDBAsync, saveDBAsync } from './db-file';
import { loadDBAsync, saveDBAsync } from './db-localStorage';

export let API = {
    arrayGet: function(key: string): Promise<any> {
        return loadDBAsync(key, []);
    },

    arrayUpdate: function(key: string, filter: Function, update: Function): Promise<any> {
        return loadDBAsync(key, []).then(function (data) {
            data.forEach(function (item, index) {
                if (filter(item)) {
                    data[index] = update(item);
                }
            });
            return saveDBAsync(key, data);
        });
    },

    arrayAdd: function(key: string, value: any): Promise<any> {
        return loadDBAsync(key, []).then(function (data) {
            data.push(value);
            return saveDBAsync(key, data);
        });
    },

    arrayDelete: function(key: string, filter: Function): Promise<any> {
        return loadDBAsync(key, []).then(function (data) {
            return saveDBAsync(key, data.filter(item => !filter(item)));
        });
    },

    nextID: function(key: string): Promise<any> {
        return loadDBAsync("IDs", {}).then(function (data) {
            var id = 0;
            if (typeof data[key] === "number") {
                id = data[key];
                data[key] += 1;
            } else {
                id = 1;
                data[key] = 2;
            }
            return saveDBAsync("IDs", data).then(_ => id);
        });
    }
}
