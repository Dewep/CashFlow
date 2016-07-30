import { Component } from '@angular/core';
import { NGB_TABSET_DIRECTIVES } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'my-operations',
    templateUrl: 'app/operations/operations.component.html',
    directives: [
        NGB_TABSET_DIRECTIVES
    ]
})

export class OperationsComponent {
}
