import { Injectable } from '@angular/core';

import { Tag } from './tag';
import { API } from '../db/api';

@Injectable()
export class TagService {
    private keyDB = "CashFlow-tags";

    getTags() {
        return API.getArray(this.keyDB).then(data => data as Tag[]);
    }

    addTag(tag: Tag) {
        return API.addToArray(this.keyDB, tag);
    }

    deleteTag(tag: Tag) {
        return API.removeFromArray(this.keyDB, function (t: Tag) {
            return t.id === tag.id;
        });
    }
}
