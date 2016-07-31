import { Injectable } from '@angular/core';

import { Tag } from './tag';
import { ArrayService } from '../db/array.service';

@Injectable()
export class TagService extends ArrayService<Tag> {
    protected keyDB = "CashFlow-tags";

    getInstanceFromStandardObject(obj) {
        return new Tag().fromStandardObject(obj);
    }
}
