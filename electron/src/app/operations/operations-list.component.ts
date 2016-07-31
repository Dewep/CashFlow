import { Component, Input } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { Operation } from './operation';

@Component({
    selector: 'my-operations-list',
    templateUrl: 'app/operations/operations-list.component.html',
    directives: [
        ROUTER_DIRECTIVES
    ]
})

export class OperationsListComponent {
    @Input() operations: Operation[];
}
