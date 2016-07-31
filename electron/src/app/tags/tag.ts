import { BaseModelDB } from '../db/base-model-db';

export class Tag extends BaseModelDB {
    name: string;

    getColor(): string {
        if (this.name.startsWith("payment:")) {
            return "warning";
        }
        return "info";
    }
}
