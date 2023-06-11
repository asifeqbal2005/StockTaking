import { Injectable } from '@angular/core';
import { EntityPermissionsService } from '../../../shared/services/entity-permissions.service';
import { EntityPermission, EntityPermissionFilter } from './entity-permissions.model';

@Injectable({
  providedIn: 'root'
})

export class EntityPermissionsDataService {

  constructor(private entityPermissionsService: EntityPermissionsService) { }

  getAllEntityPermissions() {
    return this.entityPermissionsService.getAllEntityPermissions();
  }

  getEntityPermissionByTypeId(id: number): any {
    return this.entityPermissionsService.getEntityPermissionByTypeId(id);
  }

  getLookupsByTypeId(): any {
    return this.entityPermissionsService.getLookupsByTypeId();
  }

  getEntityPermissionsItemByName(name: string) {
    return this.entityPermissionsService.getEntityPermissionsItemByName(name);
  }

  putEntityPermissions(entityPermission: EntityPermission) {
    return this.entityPermissionsService.putEntityPermissions(entityPermission);
  }

  getAllEntityPermissionsItems(data: EntityPermissionFilter): any {
    return this.entityPermissionsService.getAllEntityPermissionsItems(data);
  }

  deleteEntityPermissionItem(entityPermission: EntityPermission) {
    return this.entityPermissionsService.deleteEntityPermissionItem(entityPermission);
  }
}
