import { BaseImportPlugin } from '../base-import-plugin';

import { Operation } from '../../operation';

const iconv = (<any>window).require('iconv-lite');

export class ImportPluginFileCATxtFR extends BaseImportPlugin {
    getString(buffer: Buffer): string {
        return iconv.decode(buffer, 'win1252');
    }

    getItems(content: string): string[][] {
        var items = content.match(/Date          \:[\s\S]+?\+[-]+\+/g);
        return items.map(item => {
            var lines = item.replace(/\+[-]+\+/g, '').split('\n');
            lines.pop();
            return lines;
        });
    }

    parseDate(content: string) {
        return new Date().getFullYear() + '-' + content.substr(3, 2) + '-' + content.substr(0, 2);
    }

    parseOperation(lines: string[]): Promise<Operation> {
        return new Promise<Operation>((resolve, reject) => {
            var operation = new Operation();
            var payment_tag = null;
            var description = [];
            for (let i = 0; i < lines.length; i++) {
                var line_content = lines[i].substr(16).trim();
                if (i == 0) {
                    operation.date = this.parseDate(line_content.substr(-5));
                } else if (i == 1) {
                    if (line_content.substr(-5).match(/[0-9]{2}\/[0-9]{2}/)) {
                        operation.real_date = this.parseDate(line_content.substr(-5));
                        line_content = line_content.substr(0, line_content.length - 5).trim();
                    }
                    operation.name = line_content;
                } else if (i == lines.length - 1) {
                    var multiplier = 1;
                    if (lines[i].startsWith("Débit")) {
                        multiplier = -1;
                    }
                    operation.price = multiplier * parseFloat(line_content.replace(' ', '').replace(',', '.'));
                } else if (i >= 2) {
                    description.push(line_content);
                }
            }
            if (payment_tag !== null) {
                operation.tags.push(payment_tag);
            }
            operation.description = description.join(' ');
            resolve(operation);
        });
    }

    parseContent(buffer: Buffer): Promise<Operation[]> {
        return new Promise<string[][]>(resolve => {
            var content = this.getString(buffer);
            var items = this.getItems(content);
            resolve(items);
        }).then(items => {
            return Promise.all<Operation>(items.map(item => this.parseOperation(item)));
        });
    }
}
