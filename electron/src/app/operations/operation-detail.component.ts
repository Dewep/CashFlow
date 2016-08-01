import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

import { Operation } from './operation';
import { OperationService } from './operation.service';
import { Account } from '../accounts/account';
import { AccountService } from '../accounts/account.service';
import { Tag } from '../tags/tag';
import { TagService } from '../tags/tag.service';

@Component({
    selector: 'my-operation-detail',
    templateUrl: 'app/operations/operation-detail.component.html',
//    styles: `body { overflow: hidden; }`
})

export class OperationDetailComponent implements OnInit {
    @Input() operation: Operation = new Operation();
    @Input() saveDB: boolean = false;
    @Input() addOnly: boolean = false;
    @Output() onOperationUpdate = new EventEmitter();
    operationModel: Operation = new Operation();
    tags_origin: Tag[] = [];
    tags: Tag[] = [];
    accounts_origin: Account[] = [];
    accounts: Account[];
    error: any;
    modalOpen: boolean = false;
    modalIn: boolean = false;

    constructor(private operationService: OperationService,
        private accountService: AccountService,
        private tagService: TagService) {
    }

    ngOnInit() {
    }

    openModal() {
        this.operationModel.fromStandardObject(this.operation.toStandardObject()).then(_ => {
            this.getTags();
            this.getAccounts();
            this.modalOpen = true;
            setTimeout(_ => this.modalIn = true, 100);
        });
    }

    closeModal() {
        this.modalIn = false;
        setTimeout(_ => this.modalOpen = false, 500);
    }

    clickOnModal(event: Event) {
        event.stopPropagation();
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
        var ids_tags_operation = [];
        this.operationModel.tags.map(item => ids_tags_operation.push(item.id));
        this.tags = this.operationModel.tags.concat(this.tags_origin.filter(item => ids_tags_operation.indexOf(item.id) === -1));

        if (this.operationModel.account) {
            this.accounts = [this.operationModel.account].concat(this.accounts_origin.filter(item => item.id !== this.operationModel.account.id));
        }
    }

    save() {
        this.error = null;
        this.operation = this.operationModel;
        this.onOperationUpdate.emit(this.operation);
        if (!this.saveDB) {
            this.closeModal();
            return;
        }
        this.operationService.save(this.operation)
            .then(res => {
                this.closeModal();
            })
            .catch(error => {
                this.error = error;
            });
    }

    delete() {
        this.operationService
            .delete(this.operationModel)
            .then(res => {
                this.onOperationUpdate.emit(null);
                this.closeModal();
            })
            .catch(error => this.error = error);
    }
}
