import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Operation } from '../operation';
import { OperationService } from '../operation.service';
import { Account } from '../../accounts/account';
import { AccountService } from '../../accounts/account.service';
import { OperationsListComponent } from '../operations-list.component';

const fs = (<any>window).require('fs');

var plugins = {
    "ca-txt-fr": true
};

@Component({
    selector: 'my-operation-import-file',
    templateUrl: 'app/operations/import/operation-import-file.component.html',
    directives: [
        OperationsListComponent
    ]
})

export class OperationImportFileComponent implements OnInit, OnDestroy {
    accounts: Account[] = [];
    modelAccount: Account;
    modelFile: any;
    operations: Operation[] = [];
    error: any;
    warnings: string[] = [];
    state: string = "select_file";
    sub: any;
    plugin_name: string;

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
            if (params['plugin'] !== undefined && plugins[params['plugin']]) {
                //...
            } else {
                this.error = "Unknow plugin.";
                this.state = "unknow_plugin";
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    read_file() {
        console.log(this.modelFile);
        /*electron.remote.dialog.showOpenDialog({properties: ['openFile'], filters: [{name: 'CA TXT FR', extensions: ['*.txt']}]}, fileName => {
            if (!fileName) {
                this.error = 'You need to select the txt file.';
                return;
            }
            this.state = "parsing_file";
            this.error = null;
            this.warnings = ["Parsing file in progress..."];
        });*/
    }

    onChange(event) {
        if (!event.target.files.length) {
            this.error = 'You need to select the txt file.';
            return;
        }
        console.log(event.target.files[0]);
        this.state = "parsing_file";
        this.error = null;
        this.warnings = ['Parsing file in progress... (' + event.target.files[0].path + ')'];
        fs.readFile(event.target.files[0].path, 'utf-8', function (err, data) {
            if (err) {
                console.error(err);
                this.error = "An error ocurred reading the file :" + err.message;
                return;
            }
            console.log(data);
        });
    }

    cancelImport() {
        this.modelAccount = null;
        this.modelFile = null;
        this.operations = [];
        this.error = null;
        this.warnings = [];
        this.state = "select_file";
    }

    addOperations() {
        /*this.error = null;
        this.operationService.save(this.model)
            .then(res => {
                this.router.navigate(['/operations']);
            })
            .catch(error => {
                this.error = error;
            });*/
    }
}
