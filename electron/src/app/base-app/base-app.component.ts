import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { NGB_DIRECTIVES, NGB_PRECOMPILE } from '@ng-bootstrap/ng-bootstrap';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { OperationsComponent } from '../operations/operations.component';
import { OperationImportFileComponent } from '../operations/import/operation-import-file.component';
import { TagsComponent } from '../tags/tags.component';
import { CompaniesComponent } from '../companies/companies.component';
import { TitlesComponent } from '../titles/titles.component';
import { AccountsComponent } from '../accounts/accounts.component';

import { TagService } from '../tags/tag.service';
import { CompanyService } from '../companies/company.service';
import { TitleService } from '../titles/title.service';
import { AccountService } from '../accounts/account.service';
import { OperationService } from '../operations/operation.service';

@Component({
    selector: 'my-base-app',
    templateUrl: 'app/base-app/base-app.component.html',
    directives: [
        ROUTER_DIRECTIVES,
        NGB_DIRECTIVES
    ],
    providers: [
        TagService,
        CompanyService,
        TitleService,
        AccountService,
        OperationService
    ],
    precompile: [
        NGB_PRECOMPILE,
        DashboardComponent,
        OperationsComponent,
        OperationImportFileComponent,
        TagsComponent,
        CompaniesComponent,
        TitlesComponent,
        AccountsComponent
    ]
})

export class BaseAppComponent {
    title = 'Cash Flow';
}
