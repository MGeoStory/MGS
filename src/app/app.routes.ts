import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home-component';
import { PostReceiptComponent } from './post/receipt/post-receipt.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'post', component: null,
        children: [
            { path: 'receipt', component: PostReceiptComponent }
        ],
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);