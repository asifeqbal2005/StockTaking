import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../shared/services/notification.service';
import { SecurityService } from '../../../shared/services/security.service';
import { BaseComponentComponent } from '../../base-component/base-component.component';
import { enumAccessOnPage } from '../../../shared/models/common.enum';
import { ConfirmationPopup } from '../../../shared/components/confirmation-popup/confirmation-popup';
import { EntityService } from '../../../shared/services/entity.service';
import { PageType } from "../../../shared/enums/base.enum";
import { StatusCode } from '../../../shared/enums/base.enum';

@Component({
  selector: 'app-entitymaster',
  templateUrl: './entitymaster.component.html',
  styleUrls: ['./entitymaster.component.css'],
})

export class EntityMasterComponent extends BaseComponentComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  trigger: any = new Object();
  parentEntityData: any[] = [];
  inputData: any = {};
  primaryId = 0;  
  totalTimes = 0;
  displayedColumns: any[];
  pagingType = 'full_numbers';
  pageLength = 10;  
  isAddButtonShow: boolean = true;
  isShown: boolean = false;
  pageType: PageType;  
  entityName: enumAccessOnPage = enumAccessOnPage.EntityMaster;

  constructor(public dialog: MatDialog,
    private notificationService: NotificationService,
    private entityService: EntityService,
    securityService: SecurityService) {
    super(securityService, enumAccessOnPage.EntityMaster);    
  }  

  ngOnInit(): void {
    this.pageType = PageType.Grid;    
    this.inputData = {};
    this.primaryId = 0; 
    this.getParentEntity();   
    this.getPageLayout(); 
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  getParentEntity() {
    debugger;
    this.entityService.GetParentEntities().subscribe((k: any) => {      
      this.parentEntityData = k.data;
    });
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

  initializeDataTable(): void {
    const self = this;
    self.displayedColumns = [
      { title: 'Entity Name', data: 'entityName' },
      { title: 'Navigate URL', data: 'routerLink' },
      { title: 'Description', data: 'description' },
      { title: 'Parent Entity', data: 'parentName' },
      { title: 'Display Order', data: 'displayOrder' },         
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
        { width: "18%", className: "dt-body-center", targets: 0 },
        { width: "18%", className: "dt-body-center", targets: 1 },
        { width: "18%", className: "dt-body-center", targets: 2 },
        { width: "18%", className: "dt-body-center", targets: 3 },
        { width: "18%", className: "dt-body-center", targets: 4 },
        {
          render: function (data, type, row) {
            return self.anonymousActionTemplate;
          },
          width: "10%", targets: 5
        }
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        const self = this;
        $('.edit-button', row).unbind('click');
        $('.edit-button', row).bind('click', () => {
          self.onEditEntity(data.id);
        });
        $('.remove-button', row).unbind('click');
        $('.remove-button', row).bind('click', () => {
          self.deleteConfirmation(data.id);
        });
        return row;
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.entityService.getEntities().subscribe((response: any) => {
          if (!!callback) {
            callback({
              data: response.data
            });
          }
        }, error => {
          this.notificationService.printErrorMessage('Error occurred');
        });
      }
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

  filterEntityMasterItem() {
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

  onSubmit() {    
    if (this.primaryId > 0) 
    {
      this.updateEntity();
    } 
    else 
    {
      this.saveEntity();
    }
  }

  updateEntity() {
    let request: any = {
      id: this.primaryId,
      entityName: this.inputData.entityName,
      description: this.inputData.description,
      routerLink: this.inputData.routerLink,
      isParent: this.inputData.isParent,
      parentId: this.inputData.parentEntity,
      displayOrder: this.inputData.displayOrder,
      entityIcon: this.inputData.entityIcon
    };

    request.isParent = request.isParent == "true" ? true : false;
    request.assignPermission = this.inputData.assignPermission == "true" ? true : false;

    this.entityService.updateEntity(request).subscribe((k: any) => {
      //this.notificationService.printSuccessMessage('Item updated');       
      this.notificationService.showNotificationMessage('Item updated', 'success');    
      this.cancelEntity();
      this.reRender();
    }, error => {
      if (!!error.error && error.error.Message == StatusCode.Duplicate.toString())
        this.notificationService.printErrorMessage('Item already exists');
      else
        this.notificationService.printErrorMessage('Error occurred in updating item');
    });
  }

  saveEntity() {
    let request: any = {
      entityName: this.inputData.entityName,
      description: this.inputData.description,
      routerLink: this.inputData.routerLink,
      isParent: this.inputData.isParent,
      parentId: this.inputData.parentEntity,
      displayOrder: this.inputData.displayOrder,
      entityIcon: this.inputData.entityIcon
    };
    request.isParent = request.isParent == "true" ? true : false;
    request.assignPermission = this.inputData.assignPermission == "true" ? true : false;

    this.entityService.saveEntity(request).subscribe((k: any) => {
      this.notificationService.showNotificationMessage('Item inserted', 'success'); 
      //this.notificationService.printSuccessMessage('Item inserted');
      this.cancelEntity();
      this.reRender();
    },
      error => {        
        if (!!error.error && error.error.Message == StatusCode.Duplicate.toString())
          this.notificationService.printErrorMessage('Item already exists');
        else
          this.notificationService.printErrorMessage('Error occurred in updating item');
      });
  }

  async deleteConfirmation(id) {    
    let isConfirmed = await this.notificationService.ShowConfirmationMessageBox('Delete', 'Are you sure you want to delete?', 'question', 'Yes', 'No');
    if(isConfirmed){
      this.deleteEntity(id);
    }

    // const dialogRef = this.dialog.open(ConfirmationPopup, {
    //   width: '280px',
    //   data: {
    //     primaryId: id,
    //     subTitle: 'Confirm Delete'
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (!!result && result > 0) {
    //     this.deleteEntity(result);
    //   }
    // });
  }

  deleteEntity(id) {
    this.entityService.deleteEntity(id).subscribe((k: any) => {
      this.notificationService.showNotificationMessage('Item deleted successfully', 'success'); 
      //this.notificationService.printSuccessMessage('Item deleted successfully');
      this.reRender();
    }, error => {
      if (!!error && !!error.error)
        this.notificationService.printErrorMessage('Error occurred in item deleting');
      else
        this.reRender();
    });
  }

  onEditEntity(id) {
    this.entityService.GetEntityById(id).subscribe((k: any) => {
      this.primaryId = id;
      this.pageType = PageType.Edit;
      this.inputData = {
        entityName: k.data.entityName,
        description: k.data.description,
        routerLink: k.data.routerLink,
        isParent: k.data.parentId > 0 ? 'true' : 'false',
        parentEntity: k.data.parentId,
        displayOrder: k.data.displayOrder,
        entityIcon: k.data.entityIcon,
        assignPermission: k.data.assignPermission == "true" ? "true" : "false"
      };
      this.inputData.assignPermission = k.data.assignPermission == true ? "true" : "false";
      
      this.isEditMode = true;
      this.isShown = true;
      
    }, error => {
      if (!!error && !!error.error)
        this.notificationService.printErrorMessage('Error occurred in item updating.');
    });
  }

  filterEntityMasterDtRec() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
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

  cancelEntity() {
    this.pageType = PageType.Grid;    
    this.isShown = false;   
    this.isAddButtonShow = true; 
    this.inputData = {};
    this.primaryId = 0;
  }

  hideAddButton(showHide) {
    this.pageType = PageType.Add;
    this.isEditMode = false;
    this.isAddButtonShow = showHide;
    this.isShown = true;
    
  }

  hideform() {
    this.isShown = false;
    this.isEditMode = false;
    this.isAddButtonShow = true;
  }

}

