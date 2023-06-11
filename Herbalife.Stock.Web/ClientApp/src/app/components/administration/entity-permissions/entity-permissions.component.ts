import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewChecked } from '@angular/core';
import { EntityPermissionsDataService } from './entity-permissions.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EntityPermission, EntityPermissionFilter } from './entity-permissions.model';
import { NotificationService } from '../../../shared/services/notification.service';
import { BaseComponentComponent } from '../../base-component/base-component.component';
import { SecurityService } from '../../../shared/services/security.service';
import { enumAccessOnPage, enumCheckbox } from '../../../shared/models/common.enum';
import { ConfirmationPopup } from 'src/app/shared/components/confirmation-popup/confirmation-popup';

@Component({
  selector: 'app-entity-permissions',
  templateUrl: './entity-permissions.component.html',
  styleUrls: ['./entity-permissions.component.css']
})
export class EntityPermissionsComponent extends BaseComponentComponent implements OnInit {
  public lookupTypes: any[];
  public EntityPermissionVM: EntityPermission = new EntityPermission();
  public EntityPermissionFilter: EntityPermissionFilter = new EntityPermissionFilter();
  public selectedItemsList = [];
  public checkedActions = [];
  public EntityPermissionResult: any;

  @ViewChild(DataTableDirective, { static: false })
  private datatableElement: DataTableDirective;
  @ViewChild('datasetupTable') datasetupTable: ElementRef;
  @ViewChild(NgForm, { static: false })
  private form: NgForm;

  private typeForm: NgForm;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  errorReceived: boolean;
  isShown: boolean = false;
  isEditMode: boolean = false;
  isSaveButtonMode: boolean = true;
  public minDate = new Date();

  constructor(private router: Router,    
    private notificationService: NotificationService,
    public dialog: MatDialog,
    private entityPermissionService: EntityPermissionsDataService, securityService: SecurityService) {
    super(securityService, enumAccessOnPage.DataSetup);
    this.EntityPermissionVM.entityName = "0";
    this.minDate = new Date(2019, 0, 1);
  }

  displayedColumns: any[] = [
    { title: 'ID', data: 'entityPermissionId' },
    { title: 'Entity Name', data: 'entityName' },
    { title: 'Create', data: 'isCreate' },
    { title: 'Read', data: 'isRead' },
    { title: 'Update', data: 'isUpdate' },
    { title: 'Delete', data: 'isDeleted' },
    { title: 'Action', data: null, orderable: false }
  ];

  ngOnInit(): void {
    this.bindAllLookupTypes();
    this.isEditMode = false;
    this.initialiseDataTable();
  }

  initialiseDataTable(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      columns: this.displayedColumns,
      'columnDefs': [
        { width: "20%", className: "dt-body-center", targets: 0, "visible": false },
        { width: "30%", className: "dt-body-center", targets: 1 },
        {
          render: function (data, type, row) {
            return '<input type="checkbox" ' + (row.isCreate == true ? "checked" : "") + '>';
          },
          width: "10%", targets: 2
        },
        {
          render: function (data, type, row) {
            return '<input type="checkbox" ' + (row.isRead == true ? "checked" : "") + '>';
          },
          width: "10%", targets: 3
        },
        {
          render: function (data, type, row) {
            return '<input type="checkbox" ' + (row.isUpdate == true ? "checked" : "") + '>';
          },
          width: "10%", targets: 4
        },
        {
          render: function (data, type, row) {
            return '<input type="checkbox" ' + (row.isDeleted == true ? "checked" : "") + '>';
          },
          width: "10%", targets: 5
        },
        {
          render: function (data, type, row) {
            return '<button class="btn edit-button"><span title="Edit an item"><i class="fa fa-edit"></i></span></button>&nbsp;&nbsp;&nbsp;&nbsp;' +
              '<button class="btn remove-button"><span title="Delete an item"><i class="fas fa-trash-alt"></i></span></button>';
          },
          width: "10%", targets: 6
        },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('.edit-button', row).unbind('click');
        $('.edit-button', row).bind('click', () => {
          self.filterDataBasedOnEditButton(data);
        });
        $('.remove-button', row).unbind('click');
        $('.remove-button', row).bind('click', () => {
          self.removeButtonClick(data);
        });
        return row;
      },
      ajax: (dataTablesParameters: any, callback) => {
        var self = this;

        this.entityPermissionService.getAllEntityPermissionsItems(this.EntityPermissionFilter).subscribe(response => {
          this.EntityPermissionResult = response;
          callback({
            data: response
          });
        });
      }
    };

  }

  LookupItemReset() {
    let entityPermissionVMNew = this.EntityPermissionVM
    this.EntityPermissionVM = new EntityPermission();
    this.EntityPermissionVM.entityPermissionId = entityPermissionVMNew.entityPermissionId;
    this.EntityPermissionVM.isDelete = null;
  }

  LookupTypeItemReset() {
    this.EntityPermissionVM = new EntityPermission();
  }

  getEntityPermissionItems(entityPermissionId) {
    this.errorReceived = false;
    if (entityPermissionId > 0) {
      return this.entityPermissionService.getEntityPermissionByTypeId(entityPermissionId);
    }
    return;
  }

  deleteEntityPermissionItem(data) {
    this.entityPermissionService.deleteEntityPermissionItem(data).subscribe(data => {
      this.notificationService.printSuccessMessage('Entity Permission item deleted Successfully');
      this.rerender();
    },
      error => {
        this.notificationService.printErrorMessage('Error occured  in deleting Entity Permission item');
      }
    );
  }

  removeButtonClick(data) {

    const dialogRef = this.dialog.open(ConfirmationPopup, {
      width: '280px',
      data: {
        primaryId: data,
        subTitle: 'Are you sure you want to delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        let isdeleted = true;
        data.isDelete = isdeleted;
        this.deleteEntityPermissionItem(data);
        this.isEditMode = false;
        //this.hideform();
      }
    });
  }

  filterEntityPermissionItem() {
    let filter = this.EntityPermissionFilter;
    if (this.datatableElement.dtInstance) {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    }
    else {
      this.dtTrigger.next();
    }
  }

  clearEntityPermissionFilter() {

    this.EntityPermissionFilter.fromFilter = null;
    this.EntityPermissionFilter.toFilter = null;
    this.EntityPermissionFilter.entityNameFilter = null;
    this.EntityPermissionFilter.permissionFilter = null;
    this.rerender();
  }

  filterDataBasedOnEditButton(userdata) {
    this.getCheckedList();
    let data = this.EntityPermissionResult.find(
      item => {
        return item.entityPermissionId == userdata.entityPermissionId
      }
    )
    const perData = data.permission.split("|");
    perData.forEach((input: any) => {
      const alreadyExist = this.checkboxesDataList.find(k => k.action == input);
      if (!!alreadyExist) {
        alreadyExist.isChecked = true;
      }
    });
    this.EntityPermissionVM = {
      entityPermissionId: data.entityPermissionId,
      entityName: data.entityName,
      permission: data.permission,
      isDelete: data.isDelete,
      isCreate: data.isCreate,
      isRead: data.isRead,
      isUpdate: data.isUpdate,
      isDeleted: data.isDeleted
    }
    this.isSaveButtonMode = false;
    console.log("filterd data", data);
    console.log("filterd data", this.EntityPermissionVM);
  }

  bindAllLookupTypes() {
    this.entityPermissionService.getLookupsByTypeId().subscribe((response: any) => {
      if (response) {
        this.lookupTypes = response;
      }
    });
  }

  getCheckedList() {
    this.checkboxesDataList = [
      {
        label: enumCheckbox.Create,
        action: enumCheckbox.actionCreare,
        isChecked: false
      },
      {
        label: enumCheckbox.Read,
        action: enumCheckbox.actionRead,
        isChecked: false
      },
      {
        label: enumCheckbox.Update,
        action: enumCheckbox.actionUpdate,
        isChecked: false
      },
      {
        label: enumCheckbox.Delete,
        action: enumCheckbox.actionDelete,
        isChecked: false
      }
    ];
  }

  checkboxesDataList = [];
  changeSelection() {
    this.fetchSelectedItems()
  }

  fetchSelectedItems() {
    this.selectedItemsList = this.checkboxesDataList.filter((value, index) => {
      return value.isChecked
    });
  }

  fetchCheckedIDs() {
    this.checkedActions = []
    this.checkboxesDataList.forEach((value, index) => {
      if (value.isChecked) {
        this.checkedActions.push(value.action);
      }
    });
  }

  onEntityPermissionChange() {
    this.getCheckedList();
    this.isSaveButtonMode = false;
    this.isShown = false;
  }

  putEntityPermissionItem(data) {
    this.entityPermissionService.putEntityPermissions(data).subscribe(data => {
      if (data) {
        this.notificationService.printSuccessMessage('Entity permission updated Successfully');
      } else {
        this.notificationService.printSuccessMessage('Entity permission created Successfully');
      }
      this.rerender();
    },
      error => {
        this.notificationService.printErrorMessage('Error occured  in updating Entity permission');
      }
    );
  }

  rerender(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  onSubmit() {
    if (this.EntityPermissionVM.entityName != undefined && this.EntityPermissionVM.entityName != '0') {
      let entityPermissionName = this.EntityPermissionVM.entityName;
      this.entityPermissionService.getEntityPermissionsItemByName(entityPermissionName).subscribe(data => {
        this.EntityPermissionVM.permission = data;
      });
      this.fetchCheckedIDs();
      this.EntityPermissionVM.permission = this.checkedActions.join('|')
      if (this.checkboxesDataList.filter(x => x.isChecked == true).length > 0) {
        this.putEntityPermissionItem(this.EntityPermissionVM);
      }
      else {
        this.notificationService.printErrorMessage('Please select at least one permission');
      }
    }
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
