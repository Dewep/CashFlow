import { Injectable } from '@angular/core';

import { Title } from './Title';
import { ArrayService } from '../db/array.service';

@Injectable()
export class TitleService extends ArrayService<Title> {
    protected keyDB = "CashFlow-titles";

    getInstanceFromStandardObject(obj) {
        return new Title().fromStandardObject(obj);
    }
}
