import { API } from '../db/api';

import { BaseModelDB } from './base-model-db';

export abstract class ArrayService<T extends BaseModelDB> {
    protected keyDB = undefined;

    abstract getInstanceFromStandardObject(obj): Promise<T>;

    getAll(): Promise<T[]> {
        return API.arrayGet(this.keyDB).then(data => {
            return Promise.all<T>(data.map(item => this.getInstanceFromStandardObject(item)))
        });
    }

    find(filter: Function): Promise<T[]> {
        return this.getAll().then(data => data.filter(item => filter(item)));
    }

    findOne(filter: Function): Promise<T> {
        return this.find(filter).then(data => data.length ? data[0] : null);
    }

    save(item: T): Promise<void> {
        if (typeof item.id === "number" && item.id > 0) {
            return this.update(item);
        }
        return this.add(item);
    }

    update(item: T): Promise<void> {
        return API.arrayUpdate(this.keyDB, t => t.id === item.id, t => item.toStandardObject());
    }

    add(item: T): Promise<void> {
        return API.nextID(this.keyDB).then(id => {
            item.id = id;
            return API.arrayAdd(this.keyDB, item.toStandardObject());
        });
    }

    delete(item: T): Promise<void> {
        return API.arrayDelete(this.keyDB, t => t.id === item.id);
    }
}
