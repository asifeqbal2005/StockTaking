import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables/src/angular-datatables.directive';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PageType } from '../../../shared/enums/base.enum';
import { enumAccessOnPage } from '../../../shared/models/common.enum';
import { SecurityService } from '../../../shared/services/security.service';
import { UserGroupService } from '../../../shared/services/usergroupservice';
import { BaseComponentComponent } from '../../base-component/base-component.component';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent extends BaseComponentComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  pageType: PageType;
  displayedColumns: any[];
  pagingType = 'full_numbers';
  pageLength = 10;

  isShown: boolean = false;
  isEditMode: boolean = false;
  totalTimes = 0;
  inputData: any = {};
  groupListResult: any[];
  selectedgroup: any;
  userListResult: any[];
  selecteduser: any;
  usergroupResult: any[];
  form: NgForm;

  constructor(private userGroupService: UserGroupService, 
    securityService: SecurityService, 
    private notificationService: NotificationService) {

    super(securityService, enumAccessOnPage.ManageUser);
  }

  ngOnInit(): void {
    this.pageType = PageType.Grid;
    this.inputData = {};
    this.getUserList();
    this.getUserGroupList();
    this.getPageLayout();
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

  initializeDataTable() {
    const self = this;
    self.displayedColumns = [
      { title: 'User Name', data: 'userName' },
      { title: 'Email Id', data: 'email' },
      { title: 'Group Name', data: 'groupName' },
      { title: 'Action', data: null, orderable: false },
    ];

    self.dtOptions = {
      pagingType: self.pagingType,
      pageLength: self.pageLength,
      processing: true,
      language: self.commonDtTypesLanguage,
      columns: this.displayedColumns,
      scrollX: true,
      'columnDefs': [
        { width: "30%", className: "dt-body-center", targets: 0 },
        { width: "30%", className: "dt-body-center", targets: 1 },
        { className: "dt-body-center", targets: 2 },
        {
          render: function (data, type, row) {
            return self.anonymousActionTemplate;
          },
          width: "10%", targets: 3
        }
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        const self = this;
        $('.edit-button', row).unbind('click');
        $('.edit-button', row).bind('click', () => {
          self.onEditUserDetail(data);
        });
        $('.remove-button', row).unbind('click');
        $('.remove-button', row).bind('click', () => {
          //self.deleteConfirmation(data.id);
        });
        return row;
      },
      ajax: (dataTablesParameters: any, callback) => {
        self.userGroupService.getClaimHandlers().subscribe((response: any) => {  
          this.usergroupResult = response.data       
          callback({
            data: response.data
          });
        }, error => {
          this.notificationService.printErrorMessage('Error occurred  when getting users detail');
        });
      }
    }
  }

  reRender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  getUserList(){
    this.userGroupService.getClaimHandlers().subscribe((response: any) => {
      if(response){
        this.userListResult = response.data;
        this.selecteduser = this.userListResult[0];
      }
    }, (err: any) => {
      this.notificationService.printErrorMessage('Error occurred when getting user list');
    });
  }

  getUserGroupList()
  {    
    this.userGroupService.getUserGroupList().subscribe((response: any) => {
      if(response){
        this.groupListResult = response.data;
        this.selectedgroup = this.groupListResult[0];
      }
    }, (err: any) => {
      this.notificationService.printErrorMessage('Error occurred when getting group list');
    });
  }
  
  cancelUserGroup()
  {
    this.form.resetForm();
    this.inputData.userId = 0;    
    this.isShown = false;
    this.isEditMode = false;        
  }

  onEditUserDetail(useritem: any){
    
    let data = this.usergroupResult.find(
      item => {
        return item.userId == useritem.userId
      }
    )

    // let usergroupitem : ManageUserGroupModel = {
    //   userId : data.userId,
    //   groupId : data.groupId
    // }    
    
    this.inputData.userId = data.userId;
    this.inputData.email = data.email;
    this.inputData.groupId = data.groupId;
    //this.inputData.selecteduser = usergroupitem.userId;
    console.log(this.inputData);

    this.isEditMode = true;
    this.isShown = true;

  }

  onSubmit(){
    let request: any = {
      userName: this.inputData.selecteduser,
      email: this.inputData.email,
      groupId: this.inputData.selectedgroup            
    };

    console.log(request);
  }

}
