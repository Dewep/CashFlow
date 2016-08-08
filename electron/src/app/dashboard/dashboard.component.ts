import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { Operation } from '../operations/operation';
import { OperationService } from '../operations/operation.service';
import { OperationsLineChartComponent } from './chart/operations-line-chart.component';
import { TagsSunburstChartComponent } from './chart/tags-sunburst-chart.component';
import { TagsBarChartComponent } from './chart/tags-bar-chart.component';

@Component({
    selector: 'my-dashboard',
    templateUrl: 'app/dashboard/dashboard.component.html',
    directives: [
        OperationsLineChartComponent,
        TagsSunburstChartComponent,
        TagsBarChartComponent
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
