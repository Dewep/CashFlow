import { ReflectiveInjector } from '@angular/core';

import { Operation } from '../operation';

import { Tag } from '../../tags/tag';
import { TagService } from '../../tags/tag.service';
import { Company } from '../../companies/company';
import { CompanyService } from '../../companies/company.service';
import { Title } from '../../titles/title';
import { TitleService } from '../../titles/title.service';

export abstract class BaseImportPlugin {
    tagPaymentCheque: Tag = null;
    tagPaymentDebitCard: Tag = null;
    tagPaymentTransfer: Tag = null;
    tagPaymentCash: Tag = null;
    tagPaymentPaypal: Tag = null;
    tagPaymentDirectDebit: Tag = null;
    tags: Tag[] = [];
    companies: Company[] = [];
    titles: Title[] = [];

    abstract parseContent(buffer: Buffer): Promise<Operation[]>;

    getOperationsFromBuffer(buffer: Buffer): Promise<Operation[]> {
        var injector = null;
        return new Promise<Buffer>((resolve, reject) => {
            injector = ReflectiveInjector.resolveAndCreate([
                TagService,
                CompanyService,
                TitleService
            ]);
            resolve(buffer);
        }).then(buffer => {
            return injector.get(TagService).getAll().then(items => {
                    items.map(item => {
                        if (item.name == 'payment:cheque') this.tagPaymentCheque = item;
                        if (item.name == 'payment:debit-card') this.tagPaymentDebitCard = item;
                        if (item.name == 'payment:transfer') this.tagPaymentTransfer = item;
                        if (item.name == 'payment:cash') this.tagPaymentCash = item;
                        if (item.name == 'payment:paypal') this.tagPaymentPaypal = item;
                        if (item.name == 'payment:direct-debit') this.tagPaymentDirectDebit = item;
                    });
                    this.tags = items;
                    return buffer;
                });
        }).then(buffer => {
            return injector.get(CompanyService).getAll().then(items => {
                    this.companies = items;
                    return buffer;
                });
        }).then(buffer => {
            return injector.get(TitleService).getAll().then(items => {
                    this.titles = items;
                    return buffer;
                });
        }).then(buffer => {
            return this.parseContent(buffer);
        }).then(operations => {
            operations.forEach((value, index) => {
                var description = value.name.toLowerCase() + ' ' + value.description.toLowerCase();
                this.tags.forEach(tag => {
                    if (tag.autoMatches.some(match => description.indexOf(match.toLowerCase()) !== -1)) {
                        operations[index].tags.push(tag);
                    }
                });
                this.companies.forEach(company => {
                    if (!operations[index].company && company.autoMatches.some(match => description.indexOf(match.toLowerCase()) !== -1)) {
                        operations[index].company = company.name;
                    }
                });
                this.titles.forEach(title => {
                    if (!operations[index].title && title.autoMatches.some(match => description.indexOf(match.toLowerCase()) !== -1)) {
                        operations[index].title = title.name;
                    }
                });
            });
            return operations;
        });
    }
}
