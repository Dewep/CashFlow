import { BaseModelDB } from '../db/base-model-db';

export class Account extends BaseModelDB {
    name: string = '';
    number: string = '';
    bank: string = '';
    current: boolean = false;

    getLongTitle() {
        return `${this.name} (${this.bank} - ${this.number})`;
    }

    getTitle() {
        return `${this.name} (${this.bank})`;
    }

    getShortTitle() {
        return this.name;
    }
}
