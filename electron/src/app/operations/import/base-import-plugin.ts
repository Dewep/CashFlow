import { ReflectiveInjector } from '@angular/core';

import { Operation } from '../operation';

import { Tag } from '../../tags/tag';
import { TagService } from '../../tags/tag.service';

export abstract class BaseImportPlugin {
    paymentCheque: Tag = null;
    paymentDebitCard: Tag = null;
    paymentTransfer: Tag = null;
    paymentCash: Tag = null;
    paymentPaypal: Tag = null;
    paymentDirectDebit: Tag = null;

    getTagPaymentCheque(): Tag { return this.paymentCheque; }
    getTagPaymentDebitCard(): Tag { return this.paymentDebitCard; }
    getTagPaymentTransfer(): Tag { return this.paymentTransfer; }
    getTagPaymentCash(): Tag { return this.paymentCash; }
    getTagPaymentPaypal(): Tag { return this.paymentPaypal; }
    getTagPaymentDirectDebit(): Tag { return this.paymentDirectDebit; }

    abstract parseContent(buffer: Buffer): Promise<Operation[]>;

    getOperationsFromBuffer(buffer: Buffer): Promise<Operation[]> {
        var injector = null;
        return new Promise<Buffer>((resolve, reject) => {
            injector = ReflectiveInjector.resolveAndCreate([
                TagService
            ]);
            resolve(buffer);
        }).then(buffer => {
            return injector.get(TagService)
                .getAll()
                .then(items => {
                    items.map(item => {
                        if (item.name == 'payment:cheque') this.paymentCheque = item;
                        if (item.name == 'payment:debit-card') this.paymentDebitCard = item;
                        if (item.name == 'payment:transfer') this.paymentTransfer = item;
                        if (item.name == 'payment:cash') this.paymentCash = item;
                        if (item.name == 'payment:paypal') this.paymentPaypal = item;
                        if (item.name == 'payment:direct-debit') this.paymentDirectDebit = item;
                    });
                    return buffer;
                });
        }).then(buffer => {
            return this.parseContent(buffer);
        });
    }
}
