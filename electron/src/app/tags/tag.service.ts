import { Injectable } from '@angular/core';

import { Tag } from './tag';
import { API } from '../db/api';

@Injectable()
export class TagService {
    private keyDB = "CashFlow-tags";

    getTags(): Promise<Tag[]> {
        return API.arrayGet(this.keyDB).then(data => data as Tag[]);
    }

    save(tag: Tag): Promise<void> {
        if (typeof tag.id === "number" && tag.id > 0) {
            return this.update(tag);
        }
        return this.add(tag);
    }

    update(tag: Tag): Promise<void> {
        return API.arrayUpdate(this.keyDB, t => t.id === tag.id, t => tag);
    }

    add(tag: Tag): Promise<void> {
        return API.nextID(this.keyDB).then(id => {
            tag.id = id;
            return API.arrayAdd(this.keyDB, tag);
        });
    }

    delete(tag: Tag): Promise<void> {
        return API.arrayDelete(this.keyDB, t => t.id === tag.id);
    }
}
