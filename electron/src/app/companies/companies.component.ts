import { Component, OnInit } from '@angular/core';

import { Company } from './company';
import { CompanyService } from './company.service';

@Component({
    selector: 'my-companies',
    templateUrl: 'app/companies/companies.component.html'
})

export class CompaniesComponent implements OnInit {
    companies: Company[];
    selectedCompany: Company = null;
    modelCompany: Company;
    addingCompany = true;
    error: any;
    newMatch: string = "";

    constructor(private companyService: CompanyService) {
        this.addCompany();
    }

    addMatch() {
        if (this.selectedCompany && this.newMatch.length && this.selectedCompany.autoMatches.indexOf(this.newMatch) === -1) {
            this.selectedCompany.autoMatches.push(this.newMatch);
            this.newMatch = "";
        }
    }

    deleteMatch(match) {
        if (this.selectedCompany) {
            this.selectedCompany.autoMatches = this.selectedCompany.autoMatches.filter(item => item !== match);
        }
    }

    getCompanies() {
        this.companyService
            .getAll()
            .then(companies => this.companies = companies)
            .catch(error => this.error = error);
    }

    ngOnInit() {
        this.getCompanies();
    }

    addCompany() {
        this.addingCompany = true;
        this.selectedCompany = null;
        this.modelCompany = new Company();
    }

    selectCompany(company: Company) {
        this.selectedCompany = company;
        this.addingCompany = false;
        this.modelCompany = company;
    }

    delete() {
        if (!this.selectedCompany) {
            return;
        }
        this.companyService
            .delete(this.selectedCompany)
            .then(res => {
                this.companies = this.companies.filter(t => t.id !== this.selectedCompany.id);
                this.selectedCompany = null;
            })
            .catch(error => this.error = error);
    }

    save() {
        this.companyService.save(this.modelCompany)
            .then(res => {
                if (this.selectedCompany) {
                    this.selectedCompany = this.modelCompany;
                } else {
                    this.companies.push(this.modelCompany);
                }
                this.addCompany();
            })
            .catch(error => this.error = error);
    }
}
