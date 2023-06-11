import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LogOutComponent } from './components/log-out/log-out.component';
import { AdministrationModule } from './components/administration/administration.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InventoryModule } from './features/inventory/inventory.module';
import { DownloadsModule } from './features/downloads/downloads.module';

const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'signin-oidc', component: DashboardComponent, pathMatch: 'full' },  
  { path: 'administration', loadChildren: () => AdministrationModule }, 
  { path: 'inventory', loadChildren: () => InventoryModule },
  { path: 'downloads', loadChildren: () => DownloadsModule },  
  { path: 'log-out', component: LogOutComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [    
    RouterModule.forRoot(routes, { enableTracing: false, relativeLinkResolution: 'legacy', useHash: true }),
    CommonModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

