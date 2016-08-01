import { Component } from '@angular/core';

import { ArrayService } from '../db/array.service';
import { OperationParameterComponent } from '../operations/operation-parameter.component';
import { Title } from './title';
import { TitleService } from './title.service';

@Component({
    selector: 'my-titles',
    templateUrl: 'app/operations/operation-parameter.component.html'
})

export class TitlesComponent extends OperationParameterComponent<Title> {
    constructor(private titleService: TitleService) {
        super();
        this.parameterName = 'titles';
    }

    getService(): ArrayService<Title> {
        return this.titleService;
    };

    getNewInstance(): Title {
        return new Title();
    };
}
