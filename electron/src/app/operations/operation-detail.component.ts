import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Operation } from './operation';
import { OperationService } from './operation.service';
import { Account } from '../accounts/account';
import { AccountService } from '../accounts/account.service';
import { Tag } from '../tags/tag';
import { TagService } from '../tags/tag.service';

@Component({
    selector: 'my-operation-detail',
    templateUrl: 'app/operations/operation-detail.component.html'
})

export class OperationDetailComponent implements OnInit, OnDestroy {
    tags_origin: Tag[] = [];
    tags: Tag[] = [];
    accounts_origin: Account[] = [];
    accounts: Account[];
    model: Operation = new Operation();
    error: any;
    sub: any;
    adding: boolean = true;

    constructor(private operationService: OperationService,
        private accountService: AccountService,
        private tagService: TagService,
        private route: ActivatedRoute,
        private router: Router) {
    }

    getTags() {
        this.tagService
            .getAll()
            .then(tags => {
                this.tags_origin = tags;
                this.tags = tags;
                this.updateComponentList();
            })
            .catch(error => this.error = error);
    }

    getAccounts() {
        this.accountService
            .getAll()
            .then(accounts => {
                this.accounts_origin = accounts;
                this.accounts = accounts;
                this.updateComponentList();
            })
            .catch(error => this.error = error);
    }

    updateComponentList() {
        if (this.model) {
            var ids_tags_model = [];
            this.model.tags.map(item => ids_tags_model.push(item.id));
            this.tags = this.model.tags.concat(this.tags_origin.filter(item => ids_tags_model.indexOf(item.id) === -1));
        }

        if (this.model && this.model.account) {
            this.accounts = [this.model.account].concat(this.accounts_origin.filter(item => item.id !== this.model.account.id));
        }
    }

    ngOnInit() {
        this.getTags();
        this.getAccounts();
        this.sub = this.route.params.subscribe(params => {
            this.adding = true;
            if (params['id'] !== undefined) {
                let id = +params['id'];
                this.operationService.findOne(item => item.id === id).then(model => {
                    if (model) {
                        this.adding = false;
                        this.model = model;
                        this.updateComponentList();
                    }
                });
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    save() {
        this.error = null;
        this.operationService.save(this.model)
            .then(res => {
                this.router.navigate(['/operations']);
            })
            .catch(error => {
                this.error = error;
            });
    }
}
