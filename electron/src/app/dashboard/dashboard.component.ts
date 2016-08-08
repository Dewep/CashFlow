import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { OperationsLineChartComponent } from './chart/operations-line-chart.component';
import { TagsSunburstChartComponent } from './chart/tags-sunburst-chart.component';
import { TagsBarChartComponent } from './chart/tags-bar-chart.component';

import { Operation } from '../operations/operation';
import { OperationService } from '../operations/operation.service';
import { Account } from '../accounts/account';
import { AccountService } from '../accounts/account.service';
import { Tag } from '../tags/tag';
import { TagService } from '../tags/tag.service';
import { Company } from '../companies/company';
import { CompanyService } from '../companies/company.service';
import { Title } from '../titles/title';
import { TitleService } from '../titles/title.service';

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
    accounts: Account[] = [];
    tags: Tag[] = [];
    companies: Company[] = [];
    titles: Title[] = [];

    filteredOperations: Operation[] = [];
    filteredAccounts: Account[] = [];
    filteredTags: Tag[] = [];
    filteredCompanies: Company[] = [];
    filteredTitles: Title[] = [];

    dateStart: string = '';
    dateEnd: string = '';
    initialAccountBalance: number = 2977.28;

    constructor(private operationService: OperationService,
        private accountService: AccountService,
        private tagService: TagService,
        private companyService: CompanyService,
        private titleService: TitleService) {
    }

    toggleFilter(array, item) {
        var index = array.indexOf(item);
        if (index == -1) {
            array.push(item);
        } else {
            array.splice(index, 1);
        }
        this.filterData();
    }

    filterData() {
        this.filteredOperations = this.operations.filter(o => {
            if (this.dateStart && o.date.localeCompare(this.dateStart) < 0) {
                return false;
            }
            if (this.dateEnd && o.date.localeCompare(this.dateEnd) > 0) {
                return false;
            }
            if (!o.tags.every(t => this.filteredTags.some(t2 => t.id == t2.id))) {
                return false;
            }
            return true;
        });
    }

    getData() {
        this.operationService.getAll()
            .then(operations => this.operations = operations)
            .then(_ => this.accountService.getAll())
            .then(accounts => this.accounts = accounts)
            .then(_ => this.tagService.getAll())
            .then(tags => this.tags = tags)
            .then(_ => this.companyService.getAll())
            .then(companies => this.companies = companies)
            .then(_ => this.titleService.getAll())
            .then(titles => this.titles = titles)
            .then(_ => {
                this.filteredOperations = [];
                this.filteredAccounts = this.accounts.slice();
                this.filteredTags = this.tags.slice();
                this.filteredCompanies = this.companies.slice();
                this.filteredTitles = this.titles.slice();
            })
            .then(_ => this.filterData())
            .catch(error => console.error(error));
    }

    ngOnInit() {
        var currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 1);
        this.dateEnd = currentDate.toISOString().substr(0, 10);
        currentDate.setMonth(currentDate.getMonth() - 4);
        this.dateStart = currentDate.toISOString().substr(0, 10);
        this.getData();
    }
}
