import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { Operation } from './operation';
import { OperationService } from './operation.service';
import { OperationDetailComponent } from './operation-detail.component';

@Component({
    selector: 'my-operations',
    templateUrl: 'app/operations/operations.component.html',
    directives: [
        ROUTER_DIRECTIVES,
        OperationDetailComponent
    ]
})

export class OperationsComponent implements OnInit {
    operations: Operation[];
    error: any;

    constructor(private operationService: OperationService) {
    }

    onOperationUpdate(old_operation, new_operation) {
        if (old_operation !== null) {
            this.operations.forEach((value, index) => {
                if (value === old_operation) {
                    if (new_operation !== null) {
                        this.operations[index] = new_operation;
                    } else {
                        this.operations.splice(index, 1);
                    }
                }
            });
        } else if (new_operation !== null) {
            this.operations.push(new_operation);
        }
    }

    getOperations() {
        this.operationService
            .getAll()
            .then(operations => this.operations = operations.sort((o2, o1) => o1.date.localeCompare(o2.date)))
            .catch(error => this.error = error);
    }

    ngOnInit() {
        this.getOperations();
    }
}
