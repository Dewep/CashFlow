import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { Operation } from './operation';
import { OperationService } from './operation.service';
import { OperationsListComponent } from './operations-list.component';

@Component({
    selector: 'my-operations',
    templateUrl: 'app/operations/operations.component.html',
    directives: [
        ROUTER_DIRECTIVES,
        OperationsListComponent
    ]
})

export class OperationsComponent implements OnInit {
    operations: Operation[];
    error: any;

    constructor(private operationService: OperationService) {
    }

    getOperations() {
        this.operationService
            .getAll()
            .then(operations => this.operations = operations)
            .catch(error => this.error = error);
    }

    ngOnInit() {
        this.getOperations();
    }

    delete(operation) {
        this.operationService
            .delete(operation)
            .then(res => {
                this.operations = this.operations.filter(t => t.id !== operation.id);
            })
            .catch(error => this.error = error);
    }
}
