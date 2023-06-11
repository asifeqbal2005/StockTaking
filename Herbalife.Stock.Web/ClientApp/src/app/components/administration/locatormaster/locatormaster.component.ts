import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables/src/angular-datatables.directive';
import { Subject } from 'rxjs';
import { BaseComponentComponent } from '../../base-component/base-component.component';
import { SecurityService } from '../../../shared/services/security.service';
import { enumAccessOnPage } from '../../../shared/models/common.enum';
import { PageType } from '../../../shared/enums/base.enum';
import { LocatorModel } from '../../../shared/models/locator.model';
import { LocatorService } from '../../../shared/services/locator.service';
import { LocationService } from '../../../shared/services/location.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ConfirmationPopup } from '../../../shared/components/confirmation-popup/confirmation-popup';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-locatormaster',
  templateUrl: './locatormaster.component.html',
  styleUrls: ['./locatormaster.component.css']
})
export class LocatormasterComponent extends BaseComponentComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  trigger: any = new Object();

  displayedColumns: any[];
  pagingType = 'full_numbers';
  pageLength = 10;
  totalTimes = 0;

  pageType: PageType;
  isAddButtonShow: boolean = true;
  isShown: boolean = false;
  isEditMode: boolean = false;

  locationResult: any;
  selectedlocation: any;
  locatorModel: LocatorModel = new LocatorModel();
  locatorResult: any;

  constructor(securityService: SecurityService,
    private locatorService: LocatorService,
    private locationService: LocationService,
    private notificationService: NotificationService,
    private dialog: MatDialog) {

    super(securityService, enumAccessOnPage.Locator);
  }


  ngOnInit(): void {
    this.pageType = PageType.Grid;
    this.isEditMode = true;
    this.getAllLocations();
    this.getPageLayout();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  hideform() {
    this.isShown = false;
    this.isEditMode = false;
    this.isAddButtonShow = true;
  }

  hideAddButton(showHide) {
    this.pageType = PageType.Add;
    this.isAddButtonShow = showHide;
    this.isEditMode = false;
    this.isShown = true;
  }

  getAllLocations() {
    this.locationService.getAllLocations().subscribe((response: any) => {
      if (response) {
        this.locationResult = response.data;
        this.selectedlocation = this.locationResult[0];
      }
    }, error => {
      this.notificationService.printErrorMessage('Error occurred');
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

  reRender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  initializeDataTable() {
    const self = this;
    self.displayedColumns = [
      { title: 'Location Name', data: 'locationName' },
      { title: 'Locator Name', data: 'locatorName' },
      { title: 'Action', data: null, orderable: false },
    ];

    self.dtOptions = {
      pagingType: self.pagingType,
      pageLength: self.pageLength,
      language: self.commonDtTypesLanguage,
      columns: this.displayedColumns,
      processing: true,
      scrollX: true,
      'columnDefs': [
        { width: "40%", className: "dt-body-center", targets: 0 },
        { width: "40%", className: "dt-body-center", targets: 1 },
        {
          render: function (data, type, row) {
            return self.anonymousActionTemplate;
          },
          width: "20%", targets: 2
        }
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        const self = this;
        $('.edit-button', row).unbind('click');
        $('.edit-button', row).bind('click', () => {
          self.onEditLocator(data);
        });
        $('.remove-button', row).unbind('click');
        $('.remove-button', row).bind('click', () => {
          self.deleteConfirmation(data.locatorId);
        });
        return row;
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.locatorService.getAllLocators().subscribe((response: any) => {
          this.locatorResult = response.data
          callback({
            data: response.data
          });
        }, error => {
          this.notificationService.printErrorMessage('Error occurred');
        });
      }
    }
  }

  onSubmit() {
    if (this.pageType === PageType.Add) {
      this.locatorModel.id = 0;
      this.locatorModel.locationId = this.selectedlocation.locationId;
      this.locatorService.insertLocator(this.locatorModel).subscribe(data => {
        if (data) {
          this.notificationService.printSuccessMessage('Item created successfully.');
          this.reRender();
          this.hideform();
        }
      });
    }
    else if (this.pageType === PageType.Edit) {
      this.locatorService.updateLocator(this.locatorModel).subscribe(data => {
        if (data) {
          this.notificationService.printSuccessMessage('Item updated successfully.');
          this.reRender();
          this.hideform();
        }
      });
    }
  }

  onEditLocator(locator: any) {
    this.pageType = PageType.Edit;
    let data = this.locatorResult.find(
      item => {
        return item.locatorId == locator.locatorId
      }
    )

    this.locatorModel.id = data.locatorId;
    this.locatorModel.locationId = data.locationId;
    this.locatorModel.locatorName = data.locatorName;

    this.isEditMode = true;
    this.isShown = true;
  }

  onLocationSelected(locationId) {
    this.selectedlocation = this.locationResult.find(o => o.locationId === locationId);
  }

  deleteConfirmation(locatorId) {
    const dialogRef = this.dialog.open(ConfirmationPopup, {
      width: '280px',
      data: {
        primaryId: locatorId,
        subTitle: 'Confirm Delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result && result > 0) {
        this.deleteLocator(result);
      }
    });
  }

  deleteLocator(locatorId) {
    this.locatorService.deleteLocator(locatorId).subscribe((k: any) => {
      this.notificationService.printSuccessMessage('Item deleted  successfully');
      this.reRender();
    }, error => {
      if (!!error && !!error.error)
        this.notificationService.printErrorMessage('Error occurred in item deleting');
      else
        this.reRender();
    });
  }

  cancelLocator() {
    this.pageType = PageType.Grid;
    this.isShown = false;
    this.isAddButtonShow = true;
    this.locatorModel = new LocatorModel();
  }

}
