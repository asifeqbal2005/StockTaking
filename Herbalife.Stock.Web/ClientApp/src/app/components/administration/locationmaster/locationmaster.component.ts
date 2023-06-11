import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables/src/angular-datatables.directive';
import { BaseComponentComponent } from '../../base-component/base-component.component';
import { PageType } from "../../../shared/enums/base.enum";
import { Subject } from 'rxjs';
import { SecurityService } from '../../../shared/services/security.service';
import { LocationService } from '../../../shared/services/location.service';
import { enumAccessOnPage } from '../../../shared/models/common.enum';
import { NotificationService } from '../../../shared/services/notification.service';
import { CountryService } from '../../../shared/services/country.service';
import { LocationModel } from '../../../shared/models/location.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopup } from '../../../shared/components/confirmation-popup/confirmation-popup';

@Component({
  selector: 'app-locationmaster',
  templateUrl: './locationmaster.component.html',
  styleUrls: ['./locationmaster.component.css']
})
export class LocationmasterComponent extends BaseComponentComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  trigger: any = new Object();

  displayedColumns: any[];
  pagingType = 'full_numbers';
  pageLength = 10;

  pageType: PageType;
  totalTimes = 0;
  countryResult: any;

  isAddButtonShow: boolean = true;
  isShown: boolean = false;
  isEditMode: boolean = false;

  selectedcountry: any;
  locationModel: LocationModel = new LocationModel();
  locationResult: any;

  constructor(private locationService: LocationService,
    securityService: SecurityService,
    private notificationService: NotificationService,
    private countryService: CountryService, public dialog: MatDialog) {
    super(securityService, enumAccessOnPage.Location);
  }

  ngOnInit(): void {
    this.pageType = PageType.Grid;
    this.isEditMode = true;
    this.getAllCountries();
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
      { title: 'Country Name', data: 'countryName' },
      { title: 'Location Name', data: 'locationName' },
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
          self.onEditLocation(data);
        });
        $('.remove-button', row).unbind('click');
        $('.remove-button', row).bind('click', () => {
          self.deleteConfirmation(data.locationId);
        });
        return row;
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.locationService.getAllLocations().subscribe((response: any) => {
          this.locationResult = response.data
          callback({
            data: response.data
          });
        }, error => {
          this.notificationService.printErrorMessage('Error occurred');
        });

      }
    }
  }

  getAllCountries() {
    this.countryService.GetAllCountries().subscribe((response: any) => {
      if (response) {
        this.countryResult = response.data;
        this.selectedcountry = this.countryResult[0];
      }
    }, error => {
      this.notificationService.printErrorMessage('Error occurred');
    });
  }

  onSubmit() {
    if (this.pageType === PageType.Add) {
      this.locationModel.id = 0;
      this.locationModel.countryId = this.selectedcountry.id;
      this.locationService.insertLocation(this.locationModel).subscribe(data => {
        if (data) {
          this.notificationService.printSuccessMessage('Item created successfully.');
          this.reRender();
          this.hideform();
        }
      });
    }
    else if (this.pageType === PageType.Edit) {
      this.locationService.updateLocation(this.locationModel).subscribe(data => {
        if (data) {
          this.notificationService.printSuccessMessage('Item updated successfully.');
          this.reRender();
          this.hideform();
        }
      });
    }
  }

  onEditLocation(location: any) {
    let data = this.locationResult.find(
      item => {
        return item.locationId == location.locationId
      }
    )

    this.pageType = PageType.Edit;
    this.locationModel.id = data.locationId;
    this.locationModel.countryId = data.countryId;
    this.locationModel.locationName = data.locationName;

    this.isEditMode = true;
    this.isShown = true;
  }

  onCountrySelected(countryId) {
    this.selectedcountry = this.countryResult.find(o => o.id === countryId);
  }

  deleteConfirmation(locationId) {    
    const dialogRef = this.dialog.open(ConfirmationPopup, {
      width: '280px',
      data: {
        primaryId: locationId,
        subTitle: 'Confirm Delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {      
      if (!!result && result > 0) {
        this.deleteLocation(result);
      }
    });
  }

  deleteLocation(locationid) {    
    this.locationService.deleteLocation(locationid).subscribe((k: any) => {
      this.notificationService.printSuccessMessage('Item deleted  successfully');
      this.reRender();
    }, error => {
      if (!!error && !!error.error)
        this.notificationService.printErrorMessage('Error occurred in item deleting');
      else
        this.reRender();
    });
  }

  cancelLocation(){
    this.pageType = PageType.Grid;    
    this.isShown = false;   
    this.isAddButtonShow = true;
    this.locationModel = new LocationModel();
  }

}
