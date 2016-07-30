import { bootstrap } from '@angular/platform-browser-dynamic';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { BaseAppComponent } from './base-app/base-app.component';
import { appRouterProviders } from './app.routes';

bootstrap(BaseAppComponent, [
    appRouterProviders,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
]);
