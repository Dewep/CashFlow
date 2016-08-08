import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { Operation } from '../operations/operation';
import { OperationService } from '../operations/operation.service';
import { OperationsLineChartComponent } from './graph/operations-line-chart.component';

@Component({
    selector: 'my-dashboard',
    templateUrl: 'app/dashboard/dashboard.component.html',
    directives: [
        OperationsLineChartComponent
    ]
})

export class DashboardComponent implements OnInit {
    operations: Operation[] = [];
    initialAccountBalance: number = 2977.28;

    constructor(private operationService: OperationService) {
    }

    getOperations() {
        this.operationService
            .getAll()
            .then(operations => this.operations = operations)
            .catch(error => console.error(error));
    }

    ngOnInit() {
        this.getOperations();
    }
}
