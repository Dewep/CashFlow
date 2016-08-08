import { Component, OnInit, OnChanges, AfterViewInit, ViewChild, Input } from '@angular/core';

import { Operation } from '../../operations/operation';

import { nvD3 } from 'ng2-nvd3';
declare let d3: any;

@Component({
    selector: 'tags-sunburst-chart',
    template: `<nvd3 [options]="options" [data]="data"></nvd3>`,
    directives: [
        nvD3
    ]
})

export class TagsSunburstChartComponent implements OnInit, OnChanges {
    @Input() operations: Operation[] = [];
    @Input() tagsFilter: string = '';
    @Input() height: number = 400;
    options: any;
    data: any;

    @ViewChild(nvD3) nvD3: nvD3;

    updateData() {
        var values = {};
        this.operations.forEach(o => {
            o.tags.forEach(t => {
                if (t.name.startsWith(this.tagsFilter)) {
                    var tag_name = t.name.substr(this.tagsFilter.length);
                    var company_name = `[${tag_name}] ${o.company}`;
                    var title_name = `${company_name}: ${o.getShortTitle()}`;
                    if (!values[tag_name]) {
                        values[tag_name] = {};
                    }
                    if (!values[tag_name][company_name]) {
                        values[tag_name][company_name] = {};
                    }
                    if (!values[tag_name][company_name][title_name]) {
                        values[tag_name][company_name][title_name] = 0;
                    }
                    values[tag_name][company_name][title_name] += Math.abs(o.price);
                }
            });
        });
        var valuesToArray = function (values) {
            var data = [];
            for (var propName in values) {
                if (typeof values[propName] === 'number') {
                    data.push({name: propName, size: values[propName]});
                } else {
                    var children = valuesToArray(values[propName]);
                    if (!children.length) {
                        children = [{name: propName + ' ERROR', size: 1}];
                    }
                    data.push({name: propName, children: children});
                }
            }
            return data;
        };
        this.data = valuesToArray({Operations: values});
    }

    ngOnInit() {
        this.options = {
            chart: {
                type: 'sunburstChart',
                height: this.height,
                duration: 500,
                mode: 'value',
                tooltip: {
                    contentGenerator: d => {
                        if (!d.series.length) {
                            return '';
                        }
                        var title = d.series[0].key;
                        var value = Math.round(d.series[0].value * 100) / 100;
                        var color = d.series[0].color;
                        return `
                            <div class="card text-xs-center">
                                <p class="card-text">
                                    ${title}
                                    <span class="tag" style="background-color: ${color}">${value}€</span>
                                </p>
                            </div>
                        `;
                    }
                }
            }
        };
        this.updateData();
    }

    ngOnChanges() {
        this.updateData();
    }

    ngAfterViewInit() {
        this.nvD3.chart.update();
    }
}
