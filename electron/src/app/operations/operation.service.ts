import { Injectable } from '@angular/core';

import { Operation } from './operation';
import { ArrayService } from '../db/array.service';

@Injectable()
export class OperationService extends ArrayService<Operation> {
    protected keyDB = "CashFlow-operations";

    getInstanceFromStandardObject(obj) {
        return new Operation().fromStandardObject(obj);
    }
}
