import { Component, OnInit, OnChanges, AfterViewInit, ViewChild, Input } from '@angular/core';

import { Operation } from '../../operations/operation';

import { nvD3 } from 'ng2-nvd3';
declare let d3: any;

@Component({
    selector: 'operations-line-chart',
    template: `<nvd3 [options]="options" [data]="data"></nvd3>`,
    directives: [
        nvD3
    ]
})

export class OperationsLineChartComponent implements OnInit, OnChanges {
    @Input() initialAccountBalance: number = 0;
    @Input() operations: Operation[] = [];
    options: any;
    data: any;

    @ViewChild(nvD3) nvD3: nvD3;

    formatDate(value) {
        return d3.time.format('%d/%m/%y')(new Date(value));
    }

    updateData() {
        var values = [];
        var operations = this.operations
            .filter(o => o.date && o.date.length > 0)
            .sort((o1, o2) => o1.date.localeCompare(o2.date));
        var values_average = [];
        if (operations.length) {
            var current_date = new Date(operations[0].date);
            var end_date = new Date(operations[operations.length - 1].date);
            var balance = this.initialAccountBalance;
            var average_sum = 0;
            var average_number = 0;
            while (current_date <= end_date) {
                var current_date_string = current_date.toISOString().substr(0, 10);
                var day_operations = [];
                operations.filter(o => current_date_string == o.date).forEach(o => {
                    balance += o.price;
                    day_operations.push(o);
                });
                values.push({
                    date: current_date_string,
                    value: Math.round(balance * 100) / 100,
                    operations: day_operations
                });
                average_sum += balance;
                average_number++;
                values_average.push({
                    date: current_date_string,
                    value: Math.round(average_sum * 100 / average_number) / 100
                });
                current_date.setDate(current_date.getDate() + 1);
            }
        }
        this.data = [
            {
                key: "Operations",
                area: true,
                values: values
            },
            {
                key: "Average",
                color: "#FF7F0E",
                values: values_average
            }
        ];
    }

    ngOnInit() {
        this.options = {
            chart: {
                type: 'lineChart',
                height: 450,
                duration: 500,
                x: function(d) { return new Date(d.date); },
                y: function(d) { return d.value; },
                forceY: [0],
                xAxis: {
                    tickFormat: this.formatDate
                },
                yAxis: {
                    tickFormat: function(d) {
                        return d + "€";
                    }
                },
                useInteractiveGuideline: true,
                interpolate: "monotone",
                interactiveLayer: {
                    tooltip: {
                        contentGenerator: d => {
                            if (d.series.length == 0) {
                                return '';
                            }

                            var date = this.formatDate(d.series[0].data.date);
                            var serie_operations = d.series.find(s => s.key === "Operations");
                            var serie_average = d.series.find(s => s.key === "Average");
                            var operations = '';
                            var average = '';

                            if (serie_operations) {
                                var operations_list = '';
                                serie_operations.data.operations.forEach(o => {
                                    operations_list += `<li class="list-group-item">${o.getTitle()} <span class="tag tag-${o.getPriceColor()}">${o.price}€</span></li>`;
                                });
                                if (operations_list.length == 0) {
                                    operations_list = `<li class="list-group-item"><i>No operation this day</i></li>`;
                                }
                                operations = `
                                    <div class="card-header">
                                        <b>${date} - ${serie_operations.data.value}€</b>
                                    </div>
                                    <ul class="list-group list-group-flush">
                                        ${operations_list}
                                    </ul>
                                `;
                            }
                            if (serie_average) {
                                if (serie_operations) {
                                    average = `
                                        <div class="card-footer">
                                            <small><b>Average:</b> ${serie_average.data.value}€</small>
                                        </div>
                                    `;
                                } else {
                                    average = `
                                        <div class="card-header">
                                            <b>${date} - ${serie_average.data.value}€</b>
                                        </div>
                                    `;
                                }
                            }

                            return `
                                <div class="card text-xs-center">
                                    ${operations}
                                    ${average}
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
        this.nvD3.chart.tooltip.contentGenerator(function (d) {
          var html = "<h2>"+d.value+"</h2> <ul>";

          d.series.forEach(function(elem){
            html += "<li><h3 style='color:"+elem.color+"'>"
                    +elem.key+"</h3> : <b>"+elem.value+"</b></li>";
          })
          html += "</ul>"
          return html;
        })
        //var svg = d3.select("#" + this.nvD3.chart.id + " svg");
        /*console.log(this.nvD3.svg);
        this.nvD3.svg.append("line")
            .style("stroke", "#FF7F0E")
            .style("stroke-width", "2.5px")
            .attr("x1", 0)
            .attr("y1", this.nvD3.chart.yAxis.scale()(2500.50))
            .attr("x2", 500)
            .attr("y2", this.nvD3.chart.yAxis.scale()(2500.50));
            console.log(this.nvD3.svg);*/

        /*d3.select("#" + chartName + " svg")
            .append("text")
            .attr("x", width - margin.right / 2)
            .attr("y", yValueScale(yValue) + margin.top)
            .attr("text-anchor", "middle")
            .text(text);*/
    }
}
