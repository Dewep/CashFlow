import { Component, OnInit } from '@angular/core';

import { Tag } from './tag';
import { TagService } from './tag.service';

@Component({
    selector: 'my-tags',
    templateUrl: 'app/tags/tags.component.html'
})

export class TagsComponent implements OnInit {
    tags: Tag[];
    selectedTag: Tag = null;
    modelTag: Tag;
    addingTag = true;
    error: any;

    constructor(private tagService: TagService) {
        this.addTag();
    }

    getTags() {
        this.tagService
            .getAll()
            .then(tags => this.tags = tags)
            .catch(error => this.error = error);
    }

    ngOnInit() {
        this.getTags();
    }

    addTag() {
        this.addingTag = true;
        this.selectedTag = null;
        this.modelTag = new Tag().fromObject({ id: 0, name: "New" });
    }

    selectTag(tag: Tag) {
        this.selectedTag = tag;
        this.addingTag = false;
        this.modelTag = tag;
    }

    delete() {
        if (!this.selectedTag) {
            return;
        }
        this.tagService
            .delete(this.selectedTag)
            .then(res => {
                this.tags = this.tags.filter(t => t.id !== this.selectedTag.id);
                this.selectedTag = null;
            })
            .catch(error => this.error = error);
    }

    save() {
        this.tagService.save(this.modelTag)
            .then(res => {
                if (this.selectedTag) {
                    this.selectedTag = this.modelTag;
                } else {
                    this.tags.push(this.modelTag);
                }
                this.addTag();
            })
            .catch(error => this.error = error);
    }
}
