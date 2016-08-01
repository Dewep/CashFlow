import { BaseModelDB } from '../db/base-model-db';

export class OperationParameter extends BaseModelDB {
    name: string = '';
    autoMatches: string[] = [];
}
