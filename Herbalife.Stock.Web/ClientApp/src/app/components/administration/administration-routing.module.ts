import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { enumAccessOnPage } from '../../shared/models/common.enum';
import { RoleGuardService as RoleGuard } from '../../shared/services/role-guard.service';
//import { DataSetupComponent } from './data-setup/data-setup.component';
import { EntityPermissionsComponent } from './entity-permissions/entity-permissions.component';
//import { MultilingualComponent } from './multilingual/multilingual.component';
import { UserGroupEntityPermissionComponent } from './usergroup-entity-permission/usergroup-entity-permission.component';
import { UserGroupComponent } from './usergroup/usergroup.component';
import { AssignentitiesToUsersComponent } from './assignentities-to-users/assignentities-to-users.component';
import { EntityMasterComponent } from './entitymaster/entitymaster.component';
import { CountryMasterComponent } from './countrymaster/countrymaster.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
//import { WmsInventoryComponent } from './wms-inventory/wms-inventory.component';
import { LocationmasterComponent } from './locationmaster/locationmaster.component';
import { LocatormasterComponent } from './locatormaster/locatormaster.component';

const routes: Routes = [
  {
    path: 'entity', component: EntityMasterComponent, canActivate: [RoleGuard], data: { userPermissionsId: enumAccessOnPage.EntityMaster }
  },
  {
    path: 'manageuser', component: ManageUsersComponent, canActivate: [RoleGuard], data: { userPermissionsId: enumAccessOnPage.ManageUser }
  },
  {
    path: 'country', component: CountryMasterComponent, canActivate: [RoleGuard], data: { userPermissionsId: enumAccessOnPage.Country }
  },
  {
    path: 'usergroup', component: UserGroupComponent, canActivate: [RoleGuard], data: { userPermissionsId: enumAccessOnPage.UserGroup }
  },
  {
    path: 'usergroup-entitypermissions', component: UserGroupEntityPermissionComponent, canActivate: [RoleGuard], data: { userPermissionsId: enumAccessOnPage.UserGroupEntityPermission }
  },
  {
    path: 'entity-permissions', component: EntityPermissionsComponent, canActivate: [RoleGuard], data: { userPermissionsId: enumAccessOnPage.EntityPermission }
  }, 
  {
    path: 'assignentities-to-users', component: AssignentitiesToUsersComponent, canActivate: [RoleGuard], data: { userPermissionsId: enumAccessOnPage.AssignEntityToUser }
  },
  // {
  //   path: 'wms-inventory', component: WmsInventoryComponent
  // },
  {
    path: 'location', component: LocationmasterComponent
  },
  {
    path: 'locator', component: LocatormasterComponent
  }   
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }

