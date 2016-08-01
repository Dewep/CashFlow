import { ReflectiveInjector } from '@angular/core';

import { BaseModelDB } from '../db/base-model-db';

import { Tag } from '../tags/tag';
import { Account } from '../accounts/account';

import { TagService } from '../tags/tag.service';
import { AccountService } from '../accounts/account.service';

export class Operation extends BaseModelDB {
    name: string = '';
    date: string = '';
    real_date: string = '';
    description: string = '';
    price: number = 0;
    bank_operation_id: string = '';
    account: Account = null;
    tags: Tag[] = [];
    title: string = '';
    company: string = '';

    getTitle() {
        var prefix = "";
        if (this.company) {
            prefix += `[${this.company}] `;
        }

        if (this.title) {
            return prefix + this.title;
        }
        return prefix + this.name;
    }

    isCredit() { return this.price >= 0; }
    isDebit() { return !this.isCredit(); }
    getPriceColor() { return this.isCredit() ? 'success' : 'danger'; }

    getDescription() {
        if (this.title) {
            return this.name + '\n' + this.description;
        }
        return this.description;
    }

    getInformations() {
        var informations = [];
        if (this.date) {
            informations.push('Date: ' + (new Date(this.date).toDateString()));
        }
        if (this.real_date) {
            informations.push('Real date: ' + (new Date(this.real_date).toDateString()));
        }
        if (this.bank_operation_id) {
            informations.push('Bank Operation ID: ' + this.bank_operation_id);
        }
        if (this.account) {
            informations.push('Account: ' + this.account.getLongTitle());
        }
        return informations;
    }

    getImportantMissings() {
        var missings = [];
        if (!this.name) missings.push('Missing name');
        if (!this.date) missings.push('Missing date');
        if (!this.description) missings.push('Missing description');
        if (!this.price) missings.push('Missing price');
        if (!this.account) missings.push('Missing account');
        if (!this.tags.length) missings.push('Missing tags');
        if (!this.title) missings.push('Missing title');
        if (!this.company) missings.push('Missing company');
        return missings;
    }

    fromStandardObject(obj): Promise<BaseModelDB> {
        var injector = null;
        return new Promise<BaseModelDB>((resolve, reject) => {
            injector = ReflectiveInjector.resolveAndCreate([
                TagService,
                AccountService
            ]);
            resolve(obj);
        }).then(o => {
            return new Promise<BaseModelDB>((resolve, reject) => {
                injector.get(AccountService)
                    .findOne(item => item.id === obj["account"])
                    .then(item => {
                        this.account = item;
                        delete o["account"];
                        resolve(o);
                    });
            });
        }).then(o => {
            return new Promise<BaseModelDB>((resolve, reject) => {
                injector.get(TagService)
                    .find(item => obj["tags"].indexOf(item.id) !== -1)
                    .then(items => {
                        this.tags = items;
                        delete o["tags"];
                        resolve(o);
                    });
            });
        }).then(o => {
            return super.fromStandardObject(o);
        });
    }

    toStandardObject() {
        var obj = super.toStandardObject();
        obj["account"] = this.account ? this.account.id : null;
        obj["tags"] = this.tags.map(item => item.id);
        return obj;
    }
}
