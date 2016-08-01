import { Component } from '@angular/core';

import { ArrayService } from '../db/array.service';
import { OperationParameterComponent } from '../operations/operation-parameter.component';
import { Company } from './company';
import { CompanyService } from './company.service';

@Component({
    selector: 'my-companies',
    templateUrl: 'app/operations/operation-parameter.component.html'
})

export class CompaniesComponent extends OperationParameterComponent<Company> {
    constructor(private companyService: CompanyService) {
        super();
        this.parameterName = 'companies';
    }

    getService(): ArrayService<Company> {
        return this.companyService;
    };

    getNewInstance(): Company {
        return new Company();
    };
}
