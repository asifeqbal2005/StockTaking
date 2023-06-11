import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { DataTableDirective } from 'angular-datatables';
import { NgForm } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { SecurityService } from '../../../shared/services/security.service';
import { BaseComponentComponent } from '../../base-component/base-component.component';
import { enumAccessOnPage } from '../../../shared/models/common.enum';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopup } from '../../../shared/components/confirmation-popup/confirmation-popup';
import { StatusCode } from '../../../shared/enums/base.enum';
import { UserGroupModel } from '../../../shared/models/user-group-model';
import { UserGroupService } from '../../../shared/services/usergroupservice';


@Component({
  selector: 'app-usergroup',
  templateUrl: './usergroup.component.html',
  styleUrls: ['./usergroup.component.css'],
})

export class UserGroupComponent extends BaseComponentComponent implements OnInit {
  private form: NgForm;

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  trigger: any = new Object();

  public userGroupVM: UserGroupModel = new UserGroupModel();  
  public userGroupResult: any[];
  public claimHandlerItems: any[];
  public selectedUserItem = new Array();
  isAddButtonShow: boolean = true;
  isShown: boolean = false;  
  totalTimes = 0;
  displayedColumns: any[];
  pagingType = 'full_numbers';
  pageLength = 10;
  groupListResult: any[];
  selectedgroup: any;
  selecteduser: any;

  constructor(
    private notificationService: NotificationService,
    private userGroupService: UserGroupService,
    private dialog: MatDialog,
    securityService: SecurityService) {

    super(securityService, enumAccessOnPage.UserGroup);
  }

  ngOnInit(): void {
    this.isReadOnlyMode = false;
    this.isEditMode = true;
    this.isAddMode = true;
    this.getPageLayout();
    this.getAllClaimHandler();
    this.getUserGroupList();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  resetForm() {
    this.userGroupVM.id = 0;
    this.userGroupVM.groupName = '';
    this.userGroupVM.userId = 0;    
  }

  getAllClaimHandler() {
    this.resetForm();

    this.userGroupService.getAllClaimHandler(this.userGroupVM).subscribe(data => {
      if (data && data.length > 0) {
        this.claimHandlerItems = data;
        this.selecteduser = this.claimHandlerItems[0];
      }
    }, (error) => {
      this.notificationService.printErrorMessage('Error occurred when getting claim handler item.');
    }
    )
  }

  getUserGroupList() {
    this.userGroupService.getUserGroupList().subscribe((response: any) => {
      if (response) {
        this.groupListResult = response.data;
        this.selectedgroup = this.groupListResult[0];
      }
    }, (err: any) => {
      this.notificationService.printErrorMessage('Error occurred when getting group list');
    });
  }

  onUserSelected(userId) {
    this.selecteduser = this.claimHandlerItems.find(o => o.id === userId);
  }

  onGroupSelected(groupName) {
    this.selectedgroup = this.groupListResult.find(o => o.groupName === groupName);
  }

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

  reRender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  initializeDataTable(): void {
    const self = this;
    self.displayedColumns = [
      { title: 'User Name', data: 'userName' },
      { title: 'Group Name', data: 'groupName' },
      { title: 'Action', data: null, orderable: false },
    ];
    self.dtOptions = {
      pagingType: self.pagingType,
      pageLength: self.pageLength,
      processing: true,
      language: self.commonDtTypesLanguage,
      columns: this.displayedColumns,
      'columnDefs': [
        {
          render: function (data, type, row) {
            return row.userName;
          }, width: "40%", className: "dt-body-center", targets: 0
        },
        {
          render: function (data, type, row) {
            return row.groupName;
          }, width: "50%", className: "dt-body-left", targets: 1
        },
        {
          render: function (data, type, row) {
            return self.actionTemplate;
          },
          width: "10%", targets: 2
        }
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        // Unbind first in order to avoid any duplicate handler
        $('.edit-button', row).unbind('click');
        $('.edit-button', row).bind('click', () => {
          self.onEditUserGroup(data);
        });

        $('.remove-button', row).unbind('click');
        $('.remove-button', row).bind('click', () => {
          self.removeButtonClick(data);
        });
        return row;
      },
      ajax: (dataTablesParameters: any, callback) => {
        var self = this;
        this.userGroupService.getClaimHandlers().subscribe(response => {
          this.userGroupResult = response.data;
          callback({
            data: response.data
          });
        },
          error => {
            this.notificationService.printErrorMessage('Error occurred when getting user group item.');
          }
        );
      }
    }
  }

  onSubmit() {    
    if (this.userGroupVM.id == 0) {
      this.userGroupService.createUserGroup(this.userGroupVM).subscribe(data => {
        this.notificationService.printSuccessMessage('Item created successfully.');
        this.selectedUserItem = new Array();
        this.reRender();        
        this.hideform();
        this.resetForm();
      },
        error => {
          if (!!error.error && error.error.Message == StatusCode.Duplicate.toString())
            this.notificationService.printErrorMessage('Record already exists');
          else
            this.notificationService.printErrorMessage('Error occurred in item creating.');
        }
      );
    }
    else if (this.userGroupVM.id > 0) {
      this.userGroupService.updateUserGroup(this.userGroupVM).subscribe(data => {
        this.notificationService.printSuccessMessage('Item updated successfully.');
        this.reRender();
        this.hideform();
        this.resetForm();
      },
        error => {
          if (!!error.error && error.error.Message == StatusCode.Duplicate.toString())
            this.notificationService.printErrorMessage('Record already exists');
          else
            this.notificationService.printErrorMessage('Error occurred in item creating.');
        }
      );
    }

  }

  onEditUserGroup(userGroup) {
    this.resetForm();
    this.userGroupVM.id = userGroup.id;
    this.userGroupVM.groupName = userGroup.groupName;
    this.userGroupVM.userId = userGroup.userId;

    this.isEditMode = true;
    this.hideAddButton(false);
  }

  removeButtonClick(userGroup) {
    const dialogRef = this.dialog.open(ConfirmationPopup, {
      width: '280px',
      data: {
        primaryId: userGroup,
        subTitle: 'Are you sure you want to delete.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.userGroupService.deleteUserGroup(userGroup).subscribe(data => {
          this.notificationService.printSuccessMessage('Item deleted  successfully');          
          this.reRender();          
        },
          error => {
            this.notificationService.printErrorMessage('Error occurred in item deleting.');
          }
        );
      }
    });
  }


  /*
    async getCommonDtOptionLanguages(): Promise<any> {
      const self = this;
      let selectedLanguage = { EntityNameFilter: "Datatable", languageIdFilter: parseInt(self.languageSelectedValue) };
      return new Promise((resolve) => {
        this.multilingualService.getAllMultilingualItem(selectedLanguage).subscribe((data: any) => {
          self.commonDtTypesLanguage = {
            emptyTable: self.multilingualPipe.transform('tblEmptyTable', data),
            info: self.multilingualPipe.transform('lblInfo', data),
            infoEmpty: self.multilingualPipe.transform('lblInfoEmpty', data),
            infoFiltered: self.multilingualPipe.transform('lblInfoFiltered', data),
            lengthMenu: self.multilingualPipe.transform('lblLengthMenu', data),
            loadingRecords: self.multilingualPipe.transform('lblLoadingRecords', data),
            processing: self.multilingualPipe.transform('lblProcessing', data),
            search: self.multilingualPipe.transform('lblSearch', data),
            zeroRecords: self.multilingualPipe.transform('lblZeroRecords', data),
            paginate: {
              first: self.multilingualPipe.transform('lblPaginate_first', data),
              last: self.multilingualPipe.transform('lblPaginate_last', data),
              next: self.multilingualPipe.transform('lblPaginate_next', data),
              previous: self.multilingualPipe.transform('lblPaginate_previous', data)
            },
            aria: {
              sortAscending: self.multilingualPipe.transform('lblAria_sortAscending', data),
              sortDescending: self.multilingualPipe.transform('lblAria_sortDescending', data)
            }
          };
          resolve(self.commonDtTypesLanguage);
        });
      });
    }

    createUserGroup(claimHandlerData) {
      this.isAddUserError = false;
      let data = this.claimHandlerItems.find(
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
  
    editUserGroup() {
      let data = this.userGroupResult.find(
        item => {
          if (item.groupName == this.userGroupVM.groupName) {
            return true;
          }
        }
      )
      this.getAllClaimHandler(this.userGroupVM);
      this.isEditMode = true;
      this.hideAddButton(false);
      this.isEdit = false;      
    }
    */

  hideform() {    
    this.isAddButtonShow = true;
    this.isShown = false;
    this.isEditMode = false;    
  }

  hideAddButton(showHide) {
    this.isAddButtonShow = showHide;
    this.isShown = true;
    this.isEditMode = false;    
  }
}

