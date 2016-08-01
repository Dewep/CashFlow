import { Injectable } from '@angular/core';

import { Company } from './Company';
import { ArrayService } from '../db/array.service';

@Injectable()
export class CompanyService extends ArrayService<Company> {
    protected keyDB = "CashFlow-companies";

    getInstanceFromStandardObject(obj) {
        return new Company().fromStandardObject(obj);
    }
}
