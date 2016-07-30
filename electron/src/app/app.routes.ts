import { provideRouter, RouterConfig }  from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { OperationsComponent } from './operations/operations.component';
import { TagsComponent } from './tags/tags.component';
import { AccountsComponent } from './accounts/accounts.component';

const routes: RouterConfig = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'operations',
        component: OperationsComponent
    },
    {
        path: 'tags',
        component: TagsComponent
    },
    {
        path: 'accounts',
        component: AccountsComponent
    }
];

export const appRouterProviders = [
    provideRouter(routes)
];
