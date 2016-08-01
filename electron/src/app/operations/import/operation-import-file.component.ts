import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Operation } from '../operation';
import { OperationService } from '../operation.service';
import { Account } from '../../accounts/account';
import { AccountService } from '../../accounts/account.service';
import { OperationsListComponent } from '../operations-list.component';

import { BaseImportPlugin } from './base-import-plugin';
import { ImportPluginFileCATxtFR } from './plugins/import-plugin-file-ca-txt-fr';

const fs = (<any>window).require('fs');

@Component({
    selector: 'my-operation-import-file',
    templateUrl: 'app/operations/import/operation-import-file.component.html',
    directives: [
        OperationsListComponent
    ]
})

export class OperationImportFileComponent implements OnInit, OnDestroy {
    accounts: Account[] = [];
    account: Account;
    operations: Operation[] = [];
    error: any;
    warnings: string[] = [];
    state: string = null;
    sub: any;
    plugin_name: string;
    plugin: BaseImportPlugin;
    plugins = {
        "ca-txt-fr": ImportPluginFileCATxtFR
    };
    states = {
        "select_account": "Select the bank account",
        "select_file": "Select the file for the importation",
        "parsing_file": "Parsing in progress",
        "confirm_importation": "Check, edit and confirm the operations"
    };

    constructor(private operationService: OperationService,
        private accountService: AccountService,
        private route: ActivatedRoute,
        private router: Router) {
    }

    getAccounts() {
        this.accountService
            .getAll()
            .then(accounts => this.accounts = accounts)
            .catch(error => this.error = error);
    }

    ngOnInit() {
        this.cancelImport();
        this.getAccounts();
        this.sub = this.route.params.subscribe(params => {
            this.plugin_name = params['plugin'];
            if (params['plugin'] !== undefined && this.plugins[params['plugin']]) {
                this.plugin = new this.plugins[params['plugin']]();
            } else {
                this.error = "Unknow plugin.";
                this.state = "unknow_plugin";
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    selectAccount(account: Account) {
        this.account = account;
        this.state = "select_file";
    }

    parseFile(fileName: string): Promise<Operation[]> {
        return new Promise<Buffer>((resolve, reject) => {
            fs.readFile(fileName, {}, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        }).then(buffer => this.plugin.getOperationsFromBuffer(buffer));
    }

    onChange(event) {
        if (!event.target.files.length) {
            this.error = 'You need to select the file.';
            return;
        }
        this.state = "parsing_file";
        this.error = null;
        this.warnings = ['Parsing file in progress... (' + event.target.files[0].path + ')'];
        this.parseFile(event.target.files[0].path).then(operations => {
            operations.forEach((_, index) => operations[index].account = this.account);
            this.operations = operations;
            this.error = null;
            this.warnings = [];
            this.state = 'confirm_importation';
        }).catch(err => {
            console.error(err);
            this.cancelImport();
            this.error = "An error ocurred reading the file :" + err.message;
        });
    }

    cancelImport() {
        this.account = null;
        this.operations = [];
        this.error = null;
        this.warnings = [];
        this.state = "select_account";
    }

    addOperations() {
        this.error = null;
        this.operationService.addAll(this.operations)
            .then(res => {
                this.router.navigate(['/operations']);
            })
            .catch(error => {
                console.error(error);
                this.error = error;
            });
    }
}
