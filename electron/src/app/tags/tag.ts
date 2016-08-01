import { OperationParameter } from '../operations/operation-parameter';

export class Tag extends OperationParameter {
    getColor(): string {
        if (this.name.startsWith("payment:")) {
            return "warning";
        }
        return "info";
    }
}
