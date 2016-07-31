import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { NGB_DIRECTIVES, NGB_PRECOMPILE } from '@ng-bootstrap/ng-bootstrap';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { OperationsComponent } from '../operations/operations.component';
import { OperationsListComponent } from '../operations/operations-list.component';
import { OperationDetailComponent } from '../operations/operation-detail.component';
import { TagsComponent } from '../tags/tags.component';
import { AccountsComponent } from '../accounts/accounts.component';

import { TagService } from '../tags/tag.service';
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
        AccountService,
        OperationService
    ],
    precompile: [
        NGB_PRECOMPILE,
        DashboardComponent,
        OperationsComponent,
        OperationDetailComponent,
        TagsComponent,
        AccountsComponent,
        OperationsListComponent
    ]
})

export class BaseAppComponent {
    title = 'Cash Flow';
}
