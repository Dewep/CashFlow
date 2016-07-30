import { Component, OnInit } from '@angular/core';

import { Account } from './account';
import { AccountService } from './account.service';

@Component({
    selector: 'my-accounts',
    templateUrl: 'app/accounts/accounts.component.html'
})

export class AccountsComponent implements OnInit {
    accounts: Account[];
    selectedAccount: Account = null;
    modelAccount: Account;
    addingAccount = true;
    error: any;

    constructor(private accountService: AccountService) {
        this.addAccount();
    }

    getAccounts() {
        this.accountService
            .getAll()
            .then(accounts => this.accounts = accounts)
            .catch(error => this.error = error);
    }

    ngOnInit() {
        this.getAccounts();
    }

    addAccount() {
        this.addingAccount = true;
        this.selectedAccount = null;
        this.modelAccount = new Account().fromObject({ id: 0, name: "Account name", number: 0, bank: "Bank name", current: false });
    }

    selectAccount(account: Account) {
        this.selectedAccount = account;
        this.addingAccount = false;
        this.modelAccount = account;
    }

    delete() {
        if (!this.selectedAccount) {
            return;
        }
        this.accountService
            .delete(this.selectedAccount)
            .then(res => {
                this.accounts = this.accounts.filter(t => t.id !== this.selectedAccount.id);
                this.selectedAccount = null;
            })
            .catch(error => this.error = error);
    }

    save() {
        this.accountService.save(this.modelAccount)
            .then(res => {
                if (this.selectedAccount) {
                    this.selectedAccount = this.modelAccount;
                } else {
                    this.accounts.push(this.modelAccount);
                }
                this.addAccount();
            })
            .catch(error => this.error = error);
    }
}
