import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { PipeModule } from '../../shared/pipes/main.pipe.module';
import { DataSetupComponent } from './data-setup/data-setup.component';
import { AdministrationRoutingModule } from './administration-routing.module';
import { MultilingualPipe } from '../../shared/pipes/multilingual.pipe';
//import { MultilingualComponent } from './multilingual/multilingual.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UserGroupComponent } from './usergroup/usergroup.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { EntityPermissionsComponent } from './entity-permissions/entity-permissions.component';
import { UserGroupEntityPermissionComponent } from './usergroup-entity-permission/usergroup-entity-permission.component';
import { AssignentitiesToUsersComponent } from './assignentities-to-users/assignentities-to-users.component';
import { EntityMasterComponent } from './entitymaster/entitymaster.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
//import { CountryComponent } from '../add-resources/country/country.component'
//import { MultiCountryComponent } from '../add-resources/multi.country/multi.country.component';
//import { CountryModule } from '../add-resources/country/country.module';
import { CountryMasterComponent } from './countrymaster/countrymaster.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
//import { WmsInventoryComponent } from './wms-inventory/wms-inventory.component';
import { LocationmasterComponent } from './locationmaster/locationmaster.component';
import { LocatormasterComponent } from './locatormaster/locatormaster.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    DataSetupComponent, 
    //MultilingualComponent, 
    UserGroupComponent,
    EntityPermissionsComponent, 
    UserGroupEntityPermissionComponent,
    AssignentitiesToUsersComponent, 
    EntityMasterComponent, 
    CountryMasterComponent, 
    ManageUsersComponent, 
    //WmsInventoryComponent, 
    LocationmasterComponent, 
    LocatormasterComponent
  ],
  exports: [
    //CountryComponent, 
    //MultiCountryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    SharedModule,
    AdministrationRoutingModule,
    MatDialogModule,
    PipeModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatChipsModule,
    MatFormFieldModule,    
    MatInputModule,
    NgxPaginationModule
    //CountryModule    
  ],
  providers: [DatePipe, MultilingualPipe]
})
export class AdministrationModule { }
