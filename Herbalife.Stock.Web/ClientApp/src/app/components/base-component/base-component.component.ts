import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../../shared/services/security.service';
import * as _ from "lodash";
import { enumAccessOnPage, enumPermissions } from '../../shared/models/common.enum';

@Component({
  selector: 'app-base-component',
  templateUrl: './base-component.component.html',
  styleUrls: ['./base-component.component.css']
})
export class BaseComponentComponent implements OnInit {
  public permissionId: any;
  protected isReadOnlyMode: boolean = false;
  protected isEditMode: boolean = false;
  protected isAddMode: boolean = false;
  protected isDeleteMode: boolean = false;
  commonDtTypesLanguage: { emptyTable: any; info: any; infoEmpty: any; infoFiltered: any; lengthMenu: any; loadingRecords: any; processing: any; search: any; zeroRecords: any; paginate: { first: any; last: any; next: any; previous: any; }; aria: { sortAscending: any; sortDescending: any; }; };

  constructor(protected securityService: SecurityService, public userPermissionID: enumAccessOnPage) {
    this.getMenuPermission();
  }

  getMenuPermission() {
    this.securityService.getUserDataFromServer()
      .subscribe((data: any) => {        
        var userDetails = data.userPermission;
        var filterData = userDetails.find(c => c.entityName == this.userPermissionID);
        if (!!filterData) {
          this.permissionId = filterData.permission;
        }
        this.securityService.checkCrudMenuPermissionData();
      });
  }

  ngOnInit(): void {
  }

  get actionTemplate() {
    if (!!this.permissionId) {
      const editTemplate = this.permissionId.toString().indexOf('U') >= 0 ? '<button class="btn edit-button"><i class="fa fa-edit"></i></button>' : '';
      const deleteTemplate = this.permissionId.toString().indexOf('D') >= 0 ? '&nbsp;&nbsp;<button class="btn remove-button"><i class="fa fa-trash" style="font-weight: 600;"></i></button>' : '';
      return editTemplate + deleteTemplate;
    }
    return "";
  }

  get languageSelectedValue(): any {
    return sessionStorage.getItem("languageid");
  }

  get anonymousActionTemplate() {
    const editTemplate = '<button class="btn edit-button"><i class="fa fa-edit"></i></button>';
    const deleteTemplate = '&nbsp;&nbsp;<button class="btn remove-button"><i class="fa fa-trash" style="font-weight: 600;"></i></button>';
    return editTemplate + deleteTemplate;
  }


}
