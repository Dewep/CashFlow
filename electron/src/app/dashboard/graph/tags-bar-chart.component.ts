import { Component, OnInit, OnChanges, AfterViewInit, ViewChild, Input } from '@angular/core';

import { Operation } from '../../operations/operation';

import { nvD3 } from 'ng2-nvd3';
declare let d3: any;

@Component({
    selector: 'tags-bar-chart',
    template: `<nvd3 [options]="options" [data]="data"></nvd3>`,
    directives: [
        nvD3
    ]
})

export class TagsBarChartComponent implements OnInit, OnChanges {
    @Input() operations: Operation[] = [];
    @Input() tagsFilter: string = '';
    @Input() height: number = 450;
    options: any;
    data: any;

    @ViewChild(nvD3) nvD3: nvD3;

    formatDate(value) {
        return d3.time.format('%d/%m/%y')(new Date(value));
    }

    updateData() {
        var values = {};
        var operations = this.operations
            .filter(o => o.date && o.date.length > 0)
            .sort((o1, o2) => o1.date.localeCompare(o2.date));
        operations.forEach(o => {
            o.tags.forEach(t => {
                if (t.name.startsWith(this.tagsFilter)) {
                    values[t.name] = [];
                }
            });
        });
        if (operations.length) {
            var current_date = new Date(operations[0].date);
            var end_date = new Date(operations[operations.length - 1].date);
            while (current_date <= end_date) {
                var current_date_string = current_date.toISOString().substr(0, 10);
                for (var key in values) {
                    if (values.hasOwnProperty(key)) {
                        var day_tag_operations = [];
                        var price = 0;
                        operations.filter(o => current_date_string == o.date).forEach(o => {
                            o.tags.forEach(t => {
                                if (key == t.name) {
                                    price += Math.abs(o.price);
                                    day_tag_operations.push(o);
                                }
                            });
                        });
                        values[key].push({
                            date: current_date_string,
                            value: Math.round(price * 100) / 100,
                            operations: day_tag_operations
                        });
                    }
                }
                current_date.setDate(current_date.getDate() + 1);
            }
        }
        var data = [];
        for (var key in values) {
            if (values.hasOwnProperty(key)) {
                data.push({
                    key: key.substr(this.tagsFilter.length),
                    values: values[key]
                });
            }
        }
        this.data = data;
    }

    ngOnInit() {
        this.options = {
            chart: {
                type: 'multiBarChart',
                stacked: true,
                height: this.height,
                duration: 500,
                x: function (d) { return new Date(d.date); },
                y: function (d) { return d.value; },
                forceY: [0],
                xAxis: {
                    tickFormat: this.formatDate
                },
                yAxis: {
                    tickFormat: function (d) {
                        return d + "€";
                    }
                },
                useInteractiveGuideline: true,
                interactiveLayer: {
                    tooltip: {
                        contentGenerator: d => {
                            if (d.series.length == 0) {
                                return '';
                            }

                            var date = this.formatDate(d.series[0].data.date);
                            var operations = '';
                            var total = 0;

                            d.series.forEach(s => {
                                if (s.value > 0) {
                                    operations += `<li class="list-group-item"><span class="tag" style="background-color: ${s.color}">${s.key} (${s.value}€)</span></li>`;
                                    s.data.operations.forEach(o => {
                                        operations += `<li class="list-group-item">${o.getTitle()} <span class="tag tag-${o.getPriceColor()}">${o.price}€</span></li>`;
                                    });
                                    total += s.value;
                                }
                            });
                            if (operations.length == 0) {
                                operations = `<li class="list-group-item"><i>No operation this day</i></li>`;
                            }

                            total = Math.round(total * 100) / 100;
                            return `
                                <div class="card text-xs-center">
                                    <div class="card-header">
                                        <b>${date} - ${total}€</b>
                                    </div>
                                    <ul class="list-group list-group-flush">
                                        ${operations}
                                    </ul>
                                </div>
                            `;
                        }
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
