import { API } from '../db/api';

import { BaseModelDB } from './base-model-db';

export abstract class ArrayService<T extends BaseModelDB> {
    protected keyDB = undefined;

    abstract getInstance(): T;

    getAll(): Promise<T[]> {
        return API.arrayGet(this.keyDB).then(data => {
            return data.map(item => this.getInstance().fromObject(item));
        });
    }

    save(item: T): Promise<void> {
        if (typeof item.id === "number" && item.id > 0) {
            return this.update(item);
        }
        return this.add(item);
    }

    update(item: T): Promise<void> {
        return API.arrayUpdate(this.keyDB, t => t.id === item.id, t => item);
    }

    add(item: T): Promise<void> {
        return API.nextID(this.keyDB).then(id => {
            item.id = id;
            return API.arrayAdd(this.keyDB, item);
        });
    }

    delete(item: T): Promise<void> {
        return API.arrayDelete(this.keyDB, t => t.id === item.id);
    }
}
