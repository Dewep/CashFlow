import { Component } from '@angular/core';

import { ArrayService } from '../db/array.service';
import { OperationParameterComponent } from '../operations/operation-parameter.component';
import { Tag } from './tag';
import { TagService } from './tag.service';

@Component({
    selector: 'my-tags',
    templateUrl: 'app/operations/operation-parameter.component.html'
})

export class TagsComponent extends OperationParameterComponent<Tag> {
    constructor(private tagService: TagService) {
        super();
        this.parameterName = 'tags';
    }

    getService(): ArrayService<Tag> {
        return this.tagService;
    };

    getNewInstance(): Tag {
        return new Tag();
    };
}
