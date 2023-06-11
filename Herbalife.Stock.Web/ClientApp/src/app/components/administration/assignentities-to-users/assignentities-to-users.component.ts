import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewChecked } from '@angular/core';
import { Data, Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';
import { DataTableDirective } from 'angular-datatables';
import { NgForm } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { AssignentitiesToUser, AssignentitiesToUserFilter } from './assignentities-to-users.model';
import { SecurityService } from '../../../shared/services/security.service';
import { BaseComponentComponent } from '../../base-component/base-component.component';
import { enumAccessOnPage } from '../../../shared/models/common.enum';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopup } from '../../../shared/components/confirmation-popup/confirmation-popup';
import { AssignEntitiesToUsersDataService } from './assignentities-to-users.service';

@Component({
  selector: 'app-assignentities-to-users',
  templateUrl: './assignentities-to-users.component.html',
  styleUrls: ['./assignentities-to-users.component.css']
})

export class AssignentitiesToUsersComponent extends BaseComponentComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  private datatableElement: DataTableDirective;
  @ViewChild('datasetupTable') datasetupTable: ElementRef;

  @ViewChild(NgForm, { static: false })
  private form: NgForm;
  public AssignentitiesToUserVM: AssignentitiesToUser = new AssignentitiesToUser();
  public AssignentitiesToUserFilter: AssignentitiesToUserFilter = new AssignentitiesToUserFilter();
  public authSubscription: Subscription;
  public claimHandlerItem: any[];
  public entitiesItem: any[];
  public selectedUserItem = new Array();
  public selectedEntityItem = new Array();
  public AssignentitiesToUserResult: any;
  isDeleteButtonShow: boolean = false;
  isAddUserError: boolean = false;
  isAddEntityError: boolean = false;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  isAddButtonShow: boolean = true;
  isShown: boolean = false;

  constructor(private router: Router, public dialog: MatDialog,
    private notificationService: NotificationService,
    securityService: SecurityService, private assignEntityService: AssignEntitiesToUsersDataService) {
    super(securityService, enumAccessOnPage.DataSetup);
  }

  displayedColumns: any[] = [
    { title: 'User Name', data: 'userName' },
    { title: 'Entity Name', data: 'entityName' },
    { title: 'Action', data: null, orderable: false }
  ];

  ngOnInit(): void {
    this.initialiseDataTable();
    this.getAllClaimHandler();
    this.getAllEntityName();
  }

  initialiseDataTable(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      columns: this.displayedColumns,
      'columnDefs': [
        {
          render: function (data, type, row) {
            return row.userName;
          }, width: "30%", className: "dt-body-left", targets: 0
        },
        {
          render: function (data, type, row) {
            return row.entityName;
          }, width: "60%", className: "dt-body-center", targets: 1
        },
        {
          render: function (data, type, row) {
            return '<button class="btn edit-button"><span ><i class="fa fa-edit"></i></span></button>&nbsp;&nbsp;&nbsp;&nbsp;' +
              '<button class="btn remove-button"><span ><i class="fas fa-trash-alt"></i></span></button>';
          },
          width: "10%", targets: 2
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
        this.assignEntityService.getAllAssignEntityToUsersItems(this.AssignentitiesToUserFilter).subscribe(response => {
          this.AssignentitiesToUserResult = response;
          callback({
            data: response
          });
        });
      }
    };
  }

  filterDataBasedOnEditButton(userdata) {
    this.entitiesItem.forEach(element => {
      element.isSelected = null;
    });
    this.claimHandlerItem.forEach(element => {
      element.isSelected = null;
    });
    let data = this.AssignentitiesToUserResult.find(
      item => {
        return item.assignentitiesId == userdata.assignentitiesId
      }
    )
    const alreadyUsersExist = this.claimHandlerItem.find(k => k.id == userdata.userId);
    if (!!alreadyUsersExist) {
      alreadyUsersExist.isSelected = true;
    }
    let filterEntity = userdata.entityName.split(',');
    filterEntity = filterEntity.map(function (el) {
      return el.trim();
    });
    const alreadyExist = this.entitiesItem.find(k => k.entityId == userdata.entityId);
    if (!!alreadyExist) {
      alreadyExist.isSelected = true;
    }
   
    for (var arr in this.entitiesItem) {
      for (var filter in filterEntity) {
        if (this.entitiesItem[arr].entityName == filterEntity[filter]) {
          this.entitiesItem[arr].isSelected = true;
        }
      }
    }
    this.AssignentitiesToUserVM = {
      userPermissionId: data.userPermissionId,
      entityId: data.entityId,
      userName: data.userName,
      entityName: data.entityName,
      isSelected: data.isSelected,
      userId: data.userId,
      isDelete: data.isDelete
    }
    this.hideAddButton(false);
    console.log("filterd data", data);
    console.log("filterd data", this.AssignentitiesToUserVM);
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
        this.deleteAssignEntityToUserItem(data);
        this.isEditMode = false;
        this.isDeleteButtonShow = false;
        this.rerender();
      }
    });
  }

  getAllClaimHandler() {
    this.assignEntityService.getAllClaimHandler().subscribe((response: any) => {
      if (response) {
        this.claimHandlerItem = response;
        this.filteredlaimHandler = this.claimHandlerItem;
      }
    });
  }

  getAllEntityName() {
    this.assignEntityService.getAllEntityName().subscribe((response: any) => {
      if (response) {
        this.entitiesItem = response;
        this.filteredEntites = this.entitiesItem;
      }
    });
  }

  SaveaddAddAssignEntityToUserItem(data) {
    this.assignEntityService.addAddAssignEntityToUser(data).subscribe(data => {
      if (!data) {
        this.notificationService.printSuccessMessage('Assign entity updated Successfully');
      } else {
        this.notificationService.printSuccessMessage('Assign entity Successfully');
      }
      this.rerender();
    },
      error => {
        this.notificationService.printErrorMessage('Error occured  in updating assign entity ');
      }
    );
  }

  deleteAssignEntityToUserItem(data) {
    this.assignEntityService.deleteAssignEntityToUserItem(data).subscribe(data => {
      this.notificationService.printSuccessMessage('Assign entity item deleted Successfully');
      this.rerender();
    },
      error => {
        this.notificationService.printErrorMessage('Error occured  in deleting assign entity item');
      }
    );
  }

  filteredEntites = [];
  searchEntity(term: any) {
    if (!term) {
      this.filteredEntites = this.entitiesItem;
    }
    else {
      this.filteredEntites = this.entitiesItem.filter(x => x.entityName.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
    }
  }

  filteredlaimHandler = [];
  searchUser(term: any) {
    if (!term) {
      this.filteredlaimHandler = this.claimHandlerItem;
    }
    else {
      this.filteredlaimHandler = this.claimHandlerItem.filter(x => x.userName.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
    }
  }

  onSubmit() {
    const input = {
      UsersEntities: this.claimHandlerItem.filter(p => p.isSelected).map(k => ({ userId: k.id })),
      EntitiesNames: this.entitiesItem.filter(p => p.isSelected).map(k => ({ entityId: k.entityId }))
    };
    if (input.UsersEntities.length == 0) {
      this.isAddUserError = true;
    }
    if (input.EntitiesNames.length == 0) {
      this.isAddEntityError = true;
    }
    if (input.UsersEntities.length > 0 && input.EntitiesNames.length > 0) {
      this.SaveaddAddAssignEntityToUserItem(input);
      this.hideform();
    }
  }

  checkedUserItems(claimHandlerData) {
    this.isAddUserError = false;
    let data = this.claimHandlerItem.find(
      item => {
        if (item.id == claimHandlerData.id) {
          if (claimHandlerData.isSelected)
            item.isSelected = false;
          else
            item.isSelected = true;
          return item.userId == claimHandlerData.id
        }
      }
    )
  }

  checkedEntityItems(entityData) {
    this.isAddEntityError = false;
    let data = this.entitiesItem.find(
      item => {
        if (item.entityId == entityData.entityId) {
          if (entityData.isSelected)
            item.isSelected = false;
          else
            item.isSelected = true;
          return item.entityId == entityData.entityId
        }
      }
    )
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      dtInstance.columns().every(function () {
        const that = this;
        $('input', this.footer()).on('keyup change', function () {
          if (that.search() !== this['value']) {
            that.search(this['value'])
              .draw();
          }
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.datatableElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  hideAddButton(showHide) {
    this.isAddButtonShow = showHide;
    this.isShown = true;
  }

  hideform() {
    this.form.resetForm();
    this.AssignentitiesToUserVM.userPermissionId = 0;
    this.isAddButtonShow = true;
    this.isShown = false;
    this.isEditMode = false;
    this.isAddUserError = false;
    this.isAddEntityError = false;
    this.claimHandlerItem.forEach(x => {
      x.isSelected = null;
    });
    this.entitiesItem.forEach(x => {
      x.isSelected = null;
    });
  }
}
