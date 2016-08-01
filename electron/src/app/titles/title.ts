import { BaseModelDB } from '../db/base-model-db';

export class Title extends BaseModelDB {
    name: string = '';
    autoMatches: string[] = [];
}
