import { Component, OnInit } from '@angular/core';

import { Title } from './title';
import { TitleService } from './title.service';

@Component({
    selector: 'my-titles',
    templateUrl: 'app/titles/titles.component.html'
})

export class TitlesComponent implements OnInit {
    titles: Title[];
    selectedTitle: Title = null;
    modelTitle: Title;
    addingTitle = true;
    error: any;
    newMatch: string = "";

    constructor(private titleService: TitleService) {
        this.addTitle();
    }

    addMatch() {
        if (this.selectedTitle && this.newMatch.length && this.selectedTitle.autoMatches.indexOf(this.newMatch) === -1) {
            this.selectedTitle.autoMatches.push(this.newMatch);
            this.newMatch = "";
        }
    }

    deleteMatch(match) {
        if (this.selectedTitle) {
            this.selectedTitle.autoMatches = this.selectedTitle.autoMatches.filter(item => item !== match);
        }
    }

    getTitles() {
        this.titleService
            .getAll()
            .then(titles => this.titles = titles)
            .catch(error => this.error = error);
    }

    ngOnInit() {
        this.getTitles();
    }

    addTitle() {
        this.addingTitle = true;
        this.selectedTitle = null;
        this.modelTitle = new Title();
    }

    selectTitle(title: Title) {
        this.selectedTitle = title;
        this.addingTitle = false;
        this.modelTitle = title;
    }

    delete() {
        if (!this.selectedTitle) {
            return;
        }
        this.titleService
            .delete(this.selectedTitle)
            .then(res => {
                this.titles = this.titles.filter(t => t.id !== this.selectedTitle.id);
                this.selectedTitle = null;
            })
            .catch(error => this.error = error);
    }

    save() {
        this.titleService.save(this.modelTitle)
            .then(res => {
                if (this.selectedTitle) {
                    this.selectedTitle = this.modelTitle;
                } else {
                    this.titles.push(this.modelTitle);
                }
                this.addTitle();
            })
            .catch(error => this.error = error);
    }
}
