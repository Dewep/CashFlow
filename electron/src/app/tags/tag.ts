import { OperationParameter } from '../operations/operation-parameter';
import { Operation } from '../operations/operation';

export class Tag extends OperationParameter {
    isPaiement(): boolean {
        return this.name.startsWith("payment:");
    }

    getColor(): string {
        if (this.isPaiement()) {
            return "warning";
        }
        return "info";
    }

    isAcceptedOperation(operation: Operation): boolean {
        if (this.name.startsWith("credit:") && operation.price < 0) {
            return false;
        }
        if (this.name.startsWith("debit:") && operation.price >= 0) {
            return false;
        }
        if (this.name.startsWith("payment:direct-debit") && operation.description.indexOf("PayPal") !== -1) {
            return false;
        }
        if (this.name.startsWith("payment:") && operation.tags.some(tag => tag.name.startsWith("payment:"))) {
            return false;
        }
        return true;
    }
}
