import { Component, OnInit } from '@angular/core';

import { ArrayService } from '../db/array.service';
import { OperationParameter } from './operation-parameter';

@Component({
    selector: 'my-operation-parameter',
    templateUrl: 'app/operations/operation-parameter.component.html'
})

export abstract class OperationParameterComponent<T extends OperationParameter> implements OnInit {
    items: OperationParameter[];
    selectedItem: OperationParameter = null;
    modelItem: OperationParameter;
    addingItem = true;
    error: any;
    newMatch: string = "";
    parameterName: string = "items";

    abstract getService(): ArrayService<OperationParameter>;
    abstract getNewInstance(): T;

    constructor() {
        this.addItem();
    }

    addMatch() {
        if (this.newMatch.length && this.modelItem.autoMatches.indexOf(this.newMatch) === -1) {
            this.modelItem.autoMatches.push(this.newMatch);
            this.newMatch = "";
        }
    }

    deleteMatch(match) {
        this.modelItem.autoMatches = this.modelItem.autoMatches.filter(item => item !== match);
    }

    getItems() {
        this.getService()
            .getAll()
            .then(items => this.items = items)
            .catch(error => this.error = error);
    }

    ngOnInit() {
        this.getItems();
    }

    addItem() {
        this.addingItem = true;
        this.selectedItem = null;
        this.modelItem = this.getNewInstance();
    }

    selectItem(item: OperationParameter) {
        this.selectedItem = item;
        this.addingItem = false;
        this.modelItem = item;
    }

    delete() {
        if (!this.selectedItem) {
            return;
        }
        this.getService()
            .delete(this.selectedItem)
            .then(res => {
                this.items = this.items.filter(t => t.id !== this.selectedItem.id);
                this.selectedItem = null;
                this.addItem();
            })
            .catch(error => this.error = error);
    }

    save() {
        this.getService().save(this.modelItem)
            .then(res => {
                if (this.selectedItem) {
                    this.selectedItem = this.modelItem;
                } else {
                    this.items.push(this.modelItem);
                }
                this.addItem();
            })
            .catch(error => this.error = error);
    }
}
