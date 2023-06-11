import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { enumAccessOnPage } from '../../../shared/models/common.enum';
import { CountryService } from '../../../shared/services/country.service';
import { SecurityService } from '../../../shared/services/security.service';
import { PageType } from "../../../shared/enums/base.enum";
import { BaseComponentComponent } from '../../base-component/base-component.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopup } from '../../../shared/components/confirmation-popup/confirmation-popup';

@Component({
  selector: 'app-countrymaster',
  templateUrl: './countrymaster.component.html',
  styleUrls: ['./countrymaster.component.css']
})
export class CountryMasterComponent extends BaseComponentComponent implements OnInit, OnDestroy {
  
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;  
  
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  displayedColumns: any[];
  pagingType = 'full_numbers';
  pageLength = 10;

  
  inputData: any = {};
  primaryId = 0;
  totalTimes = 0;

  isAddButtonShow: boolean = true;  
  isShown: boolean = false;
  pageType: PageType;

  constructor(private countryService: CountryService,
    securityService: SecurityService,
    private notificationService: NotificationService, 
    private dialog: MatDialog) {
    super(securityService, enumAccessOnPage.Country);
  }

  ngOnInit(): void {
    this.pageType = PageType.Grid;
    this.inputData = {};
    this.primaryId = 0;
    this.getPageLayout();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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
    if (this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
         // Destroy the table first
        dtInstance.destroy();

        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      });
    }
    else {
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    }    
  }

  initializeDataTable() {
    const self = this;
    self.displayedColumns = [
      { title: 'Country Name', data: 'countryName' },
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
        { width: "75%", className: "dt-body-center", targets: 0 },
        {
          render: function (data, type, row) {
            return self.anonymousActionTemplate;
          },
          width: "25%", targets: 1
        }
      ],
      rowCallback: (row: Node, data: any | Object, index: number) => {
        const self = this;
        $('.edit-button', row).unbind('click');
        $('.edit-button', row).bind('click', () => {
          self.onEditCountry(data.id);
        });
        $('.remove-button', row).unbind('click');
        $('.remove-button', row).bind('click', () => {
          self.deleteConfirmation(data.id);
        });
        return row;
      },
      ajax: (dataTablesParameters: any, callback) => {
        this.countryService.GetAllCountries().subscribe((response: any) => {          
          callback({
            data: response.data
          });
        }, error => {
          this.notificationService.printErrorMessage('Error occurred');
        });
      }
    }
  }

  onEditCountry(id) {
    this.countryService.GetCountryById(id).subscribe((k: any) => {
      this.pageType = PageType.Edit;
      this.primaryId = id;
      this.inputData = {
        countryName: k.data.countryName
      };

      this.isEditMode = true;
      this.isShown = true;
    }, error => {
      if (!!error && !!error.error) {
        this.notificationService.printErrorMessage('Error occurred in item updating.');
      }
    });
  }

  onSubmit() {
    if (this.pageType == PageType.Add){
      let request: any = {
        id: 0,
        countryName: this.inputData.countryName
      };

      this.countryService.addCountry(request).subscribe((result: any) => {
        if (result == 'Duplicate') {
          this.notificationService.printSuccessMessage('Country already exists.');
        }
        else if (result == 'Fail') {
          this.notificationService.printSuccessMessage('Save Country failed.');
        }
        else if (result == 'Success') {
          this.notificationService.printSuccessMessage('Country saved');           
          this.pageType = PageType.Grid;
          this.inputData = {};
          this.primaryId = 0;         
          this.reRender();
        }
      }, error => {
        this.notificationService.printErrorMessage('Error occurred in saving Country');
      })

    }
    else if (this.pageType == PageType.Edit) {
      let request: any = {
        id: this.primaryId,
        countryName: this.inputData.countryName
      };

      this.countryService.updateCountry(request).subscribe((result: any) => {
        if (result == 'Duplicate') {
          this.notificationService.printSuccessMessage('Country already exists.');
        }
        else if (result == 'Success') {
          this.notificationService.printSuccessMessage('Country updated');           
          this.pageType = PageType.Grid;
          this.inputData = {};
          this.primaryId = 0;         
          this.reRender();
        }
      }, error => {
        this.notificationService.printErrorMessage('Error occurred in updating Country');
      });
    }
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
        this.deleteCountry(result);
      }
    });
  }

  deleteCountry(id) {
    debugger;    
    this.countryService.deleteCountry(id).subscribe((k: any) => {
      if(k){
        this.notificationService.printSuccessMessage('Country deleted  successfully');
        this.reRender();
      }
      else{
        this.notificationService.printSuccessMessage('Invalid request.');
      }
      
    }, error => {
      if (!!error && !!error.error)
        this.notificationService.printErrorMessage('Error occurred in country deleting');
      else
        this.reRender();
    });
  }

  cancelCountry(){
    this.pageType = PageType.Grid;
    this.inputData = {};
    this.primaryId = 0;
    this.isShown = false;   
    this.isAddButtonShow = true; 
  }

}
