import { Injectable } from '@angular/core';
import { EntityPermissionsService } from '../../../shared/services/entity-permissions.service';
import { ConfigurationService } from 'src/app/shared/services/configuration.service';
import { DataService } from 'src/app/shared/services/data.service';
import { AssignentitiesToUser, AssignentitiesToUserFilter } from './assignentities-to-users.model';
import { AssignEntitiesToUsersService } from '../../../shared/services/assignentities-to-users.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AssignEntitiesToUsersDataService {

  constructor(private assignEntitiesToUsersService: AssignEntitiesToUsersService, private dataService: DataService, private configurationService: ConfigurationService) { }

  getAllClaimHandler() {
    return this.assignEntitiesToUsersService.getAllClaimHandler();
  }

  getAllEntityName() {
    return this.assignEntitiesToUsersService.getAllEntityName();
  }

  getAllAssignEntityToUsersItems(data: AssignentitiesToUserFilter): any {
    return this.assignEntitiesToUsersService.getAllAssignEntityToUsersItems(data);
  }

  addAddAssignEntityToUser(assignEntity: AssignentitiesToUser) {
    return this.assignEntitiesToUsersService.addAddAssignEntityToUser(assignEntity);
  }

  deleteAssignEntityToUserItem(assignEntity: AssignentitiesToUser) {
    return this.assignEntitiesToUsersService.deleteAssignEntityToUserItem(assignEntity);
  }
}

