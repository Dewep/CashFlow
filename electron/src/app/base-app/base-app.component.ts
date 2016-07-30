import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { NGB_DIRECTIVES, NGB_PRECOMPILE } from '@ng-bootstrap/ng-bootstrap';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { OperationsComponent } from '../operations/operations.component';
import { TagsComponent } from '../tags/tags.component';
import { AccountsComponent } from '../accounts/accounts.component';

import { TagService } from '../tags/tag.service';

@Component({
    selector: 'my-base-app',
    templateUrl: 'app/base-app/base-app.component.html',
    directives: [
        ROUTER_DIRECTIVES,
        NGB_DIRECTIVES
    ],
    providers: [
        TagService
    ],
    precompile: [
        NGB_PRECOMPILE,
        DashboardComponent,
        OperationsComponent,
        TagsComponent,
        AccountsComponent
    ]
})

export class BaseAppComponent {
    title = 'Cash Flow';
}
