//import { loadDBAsync, saveDBAsync } from './db-file';
import { loadDBAsync, saveDBAsync } from './db-localStorage';

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
