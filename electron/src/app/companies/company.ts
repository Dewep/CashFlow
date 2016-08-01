import { BaseModelDB } from '../db/base-model-db';

export class Company extends BaseModelDB {
    name: string = '';
    autoMatches: string[] = [];
}
