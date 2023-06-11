import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, NgForm, Validators } from "@angular/forms";
import { BaseComponentComponent } from "../../base-component/base-component.component";
import { SecurityService } from "../../../shared/services/security.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { UserGroupEntityPermissionService } from "../../../shared/services/usergroup-entity-permission.service";
import { MatDialog } from '@angular/material/dialog';
import { PageType } from "src/app/shared/enums/base.enum";
import { DataTableDirective } from "angular-datatables";
import { Observable, Subject, Subscription } from "rxjs";
import { DatePipe } from '@angular/common'
import { enumAccessOnPage } from "src/app/shared/models/common.enum";
import { ConfirmationPopup } from "src/app/shared/components/confirmation-popup/confirmation-popup";
import { map, startWith } from "rxjs/operators";
import { StatusCode } from '../../../shared/enums/base.enum';
import { EntityService } from "src/app/shared/services/entity.service";

@Component({
  selector: 'app-usergroup-entity-permission',
  templateUrl: './usergroup-entity-permission.component.html',
  styleUrls: ['./usergroup-entity-permission.component.css']
})

export class UserGroupEntityPermissionComponent extends BaseComponentComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  @ViewChild(NgForm, { static: false })
  private form: NgForm;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  pageType: PageType;
  displayedColumns: any[];
  userGroupPrimaryId = 0;
  formInput: any = {};
  userGroupData = [];
  entitesData = [];
  permissionData = [];
  filteredEntitiesData: Observable<Array<any>>;
  selectEntitiesData: Array<any> = [];
  entitiesControl = new FormControl('', Validators.required);
  entitiesFilterString: string = '';

  filteredPermissionData: Observable<Array<any>>;
  selectPermissionData: Array<any> = [];
  permissionControl = new FormControl('', Validators.required);
  permissionFilterString: string = '';
  //languageSubscription: Subscription;
  pageLayout = [];
  totalTimes = 0;
  pagingType = 'full_numbers';
  pageLength = 10;
  trigger: any = new Object();
  isCreate = new FormControl(false);
  isRead = new FormControl(false);
  isUpdate = new FormControl(false);
  isDelete = new FormControl(false);

  constructor(
    private notificationService: NotificationService,
    public securityService: SecurityService,
    private userGroupEntityService: UserGroupEntityPermissionService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private entityService: EntityService
  ) {
    super(securityService, enumAccessOnPage.UserGroupEntityPermission);
  }

  ngOnInit(): void {
    const self = this;
    self.pageType = PageType.Grid;
    self.initialize();
    self.getPageLayout()
  }

  // Entities
  entitiesFilter = (filter: string): Array<any> => {
    this.entitiesFilterString = filter;
    if (filter.length > 0) {
      return this.entitesData.filter(option => {
        return option.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
      });
    } else {
      return this.entitesData.slice();
    }
  };

  toggleEntitiesSelection = (data: any): void => {
    data.selected = !data.selected;
    if (data.selected === true) {
      this.selectEntitiesData.push(data);
    } else {
      const i = this.selectEntitiesData.findIndex(value => value.name === data.name);
      this.selectEntitiesData.splice(i, 1);
    }
    this.entitiesControl.setValue('');
  };

  entitiesOptionClicked = (event: Event, data: any): void => {
    event.stopPropagation();
    this.toggleEntitiesSelection(data);
  };

  removeEntitiesChip = (data: any): void => {
    this.toggleEntitiesSelection(data);
  };

  /// permission
  permissionFilter = (filter: string): Array<any> => {
    this.permissionFilterString = filter;
    if (filter.length > 0) {
      return this.permissionData.filter(option => {
        return option.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
      });
    } else {
      return this.permissionData.slice();
    }
  };

  togglePermissionSelection = (data: any): void => {
    data.selected = !data.selected;

    if (data.selected === true) {
      this.selectPermissionData.push(data);
    } else {
      const i = this.selectPermissionData.findIndex(value => value.name === data.name);
      this.selectPermissionData.splice(i, 1);
    }
    this.permissionControl.setValue('');
  };

  permissionOptionClicked = (event: Event, data: any): void => {
    event.stopPropagation();
    this.togglePermissionSelection(data);
  };

  removePermissionChip = (data: any): void => {
    this.togglePermissionSelection(data);
  };

  async getPageLayout() {
    const self = this;
    self.initializeDataTable();
    if (self.totalTimes == 0) {
      setTimeout(() => {
        self.totalTimes++;
        self.dtTrigger.next();
      }, 0);
    }
    else {
      setTimeout(() => { self.reRender(); }, 1);
    }
  }

  initialize() {
    const self = this;
    self.entitiesControl = new FormControl('', Validators.required);
    self.permissionControl = new FormControl('', Validators.required);
    self.formInput = {};
    self.userGroupPrimaryId = 0;
    self.selectEntitiesData = [];
    self.selectPermissionData = [];
    self.entitiesFilterString = '';
    self.permissionFilterString = '';

    self.getEntities();
    self.getUserGroup();
    self.getEntityPermissionData();

    this.isCreate = new FormControl(false);
    this.isRead = new FormControl(false);
    this.isUpdate = new FormControl(false);
    this.isDelete = new FormControl(false);
  }

  initializeDataTable(): void {
    const self = this;
    self.displayedColumns = [
      { title: 'User Group', data: 'userGroupName' },
      { title: 'Entities', data: 'entityName' },
      { title: 'Action', data: null, orderable: false },
    ];

    self.dtOptions = {
      pagingType: self.pagingType,
      pageLength: self.pageLength,
      processing: true,
      language: self.commonDtTypesLanguage,
      columns: this.displayedColumns,
      'columnDefs': [
        { width: "20%", className: "dt-body-center", targets: 0 },
        { width: "70%", className: "dt-body-center", targets: 1 },
        {
          render: function (data, type, row) {
            return self.actionTemplate;
          },
          width: "10%", targets: 2
        }
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        const self = this;
        // Unbind first in order to avoid any duplicate handler
        $('.edit-button', row).unbind('click');
        $('.edit-button', row).bind('click', () => {
          self.onEdit(data.userGroupId);
        });

        $('.remove-button', row).unbind('click');
        $('.remove-button', row).bind('click', () => {
          self.deleteConfirmation(data.userGroupId);
        });
        return row;
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.userGroupEntityService.GetUserGroupEntitys().subscribe((response: any) => {
          if (!!callback) {
            callback({
              data: response
            });
          }
        }, error => {
          this.notificationService.printErrorMessage('Error Occurred');
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    //this.languageSubscription.unsubscribe();
  }

  reRender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  getEntities(inputData?: any) {
    const self = this;
    self.selectEntitiesData = [];

    self.userGroupEntityService.GetEntities().subscribe((response: any) => {
      if (!response)
        self.entitesData = [];
      else
        self.entitesData = response;

      if (!!inputData) {
        this.entitesData.forEach(k => {
          const alreadyData = inputData.entityData.find(g => g.id == k.id);
          if (!!alreadyData) {
            k.isCreate = alreadyData.isCreate;
            k.isDelete = alreadyData.isDelete;
            k.isRead = alreadyData.isRead;
            k.isUpdate = alreadyData.isUpdate;
            k.isSelected = alreadyData.isSelected;
          }
        });
      }
    }, error => {
      if (!!error && !!error.error)
        this.notificationService.printErrorMessage('Error occurred when getting entity item.');
    });
  }

  toggleEntityPermission(data, type) {
    if (type == 'entity') {
      data.isSelected = !data.isSelected;
      if (data.isSelected)
        data.isRead = true;
      else
        data.isRead = false;

      data.isCreate = false;
      data.isUpdate = false;
      data.isDelete = false;
    }
    else if (type == 'create') {
      data.isCreate = !data.isCreate;
    }
    else if (type == 'read') {
      data.isRead = !data.isRead;
    }
    else if (type == 'update') {
      data.isUpdate = !data.isUpdate;
    }
    else if (type == 'delete') {
      data.isDelete = !data.isDelete;
    }
  }

  getEntityPermissionData() {
    const self = this;
    self.permissionData = [{ name: 'Create', value: 'C' }, { name: 'Read', value: 'R' },
    { name: 'Update', value: 'U' }, { name: 'Delete', value: 'D' }];
    self.filteredPermissionData = self.permissionControl.valueChanges.pipe(
      startWith<string>(''),
      map(value => typeof value === 'string' ? value : self.permissionFilterString),
      map(filter => self.permissionFilter(filter))
    );
  }

  filterEntitiesItem() {
    if (this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    }
    else {
      this.dtTrigger.next();
    }
  }

  add() {
    this.pageType = PageType.Add;
    this.initialize();
  }

  cancel() {
    const self = this;
    self.ngOnInit();
    this.reRender();
  }

  onSubmit(req) {

    if (this.entitesData.filter(p => p.isSelected).length < 1 || !this.userGroupData.find(k => k.name == this.formInput.userGroupControl)) {
      this.notificationService.printErrorMessage('Please select required field.');
      return false;
    }
    if (this.entitesData.filter(p => p.isSelected).length != this.entitesData.filter(p => p.isSelected && (p.isCreate || p.isRead || p.isUpdate || p.isDelete)).length) {
      this.notificationService.printErrorMessage('Please select permission.');
      return false;
    }

    let request: any = {
      groupId: this.userGroupData.find(k => k.name == this.formInput.userGroupControl).id,
      entityData: this.entitesData.filter(p => p.isSelected)
    };

    if (this.userGroupPrimaryId > 0) {
      request.id = this.userGroupPrimaryId;
      this.update(request);
    } else {
      this.save(request);
    }
  }

  update(request) {
    this.userGroupEntityService.UpdateUserGroupEntity(request).subscribe((k: any) => {
      this.notificationService.printSuccessMessage('Item updated successfully.');
      this.ngOnInit();
      this.reRender();
    }, error => {
      if (!!error.error && error.error.Message == StatusCode.Duplicate.toString())
        this.notificationService.printErrorMessage('Record already exists');
      else
        this.notificationService.printErrorMessage('Error occurred in item updating.');
    });
  }

  save(request) {
    this.userGroupEntityService.SaveUserGroupEntity(request).subscribe((k: any) => {
      this.notificationService.printSuccessMessage('Item created successfully.');
      this.ngOnInit();
      this.reRender();
    }, error => {
      if (!!error.error && error.error.Message == StatusCode.Duplicate.toString())
        this.notificationService.printErrorMessage('Record already exists');
      else
        this.notificationService.printErrorMessage('Error occurred in item creating.');
    });
  }

  deleteConfirmation(id) {
    const dialogRef = this.dialog.open(ConfirmationPopup, {
      width: '280px',
      data: {
        primaryId: id,
        subTitle: 'Are you sure you want to delete.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result && result > 0) {
        this.delete(result);
      }
    });
  }

  delete(id) {
    this.userGroupEntityService.DeleteUserGroupEntityById(id).subscribe((k: any) => {
      this.notificationService.printSuccessMessage('Item deleted  successfully');
      this.reRender();
    }, error => {
      this.notificationService.printErrorMessage('Error occurred in item deleting.');
    });
  }

  onEdit(id) {
    this.userGroupEntityService.GetUserGroupEntityById(id).subscribe((data: any) => {
      this.pageType = PageType.Edit;
      this.userGroupPrimaryId = data.groupID;
      this.userGroupData.push({
        id: data.groupID,
        name: data.groupName
      });
      this.formInput.userGroupControl = data.groupName;

      if (!!data && this.userGroupPrimaryId > 0) {
        this.getEntities(data);
      }
      else {
        this.getEntities();
      }
    }, error => {
      this.notificationService.printErrorMessage('Error occurred when getting user group entity permission item.');
    });
  }

  getUserGroup() {
    const self = this;
    self.userGroupEntityService.GetUserGroup().subscribe((response: any) => {
      self.userGroupData = response;
    }, error => {
      this.notificationService.printErrorMessage('Error occurred when getting user group item.');
    });
  }

}


