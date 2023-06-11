import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Lookup, LookUpFilter, LookupType } from './data-setup.model';
import { NotificationService } from '../../../shared/services/notification.service';
import { DataTableDirective } from 'angular-datatables';
import { NgForm } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { SecurityService } from '../../../shared/services/security.service';
import { BaseComponentComponent } from '../../base-component/base-component.component';
import { enumAccessOnPage } from '../../../shared/models/common.enum';
import { LookupDatasetupService } from './data-setup.service';
import { MultilingualPipe } from "src/app/shared/pipes/multilingual.pipe";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopup } from 'src/app/shared/components/confirmation-popup/confirmation-popup';
import { StatusCode } from '../../../shared/enums/base.enum';

@Component({
  selector: 'app-data-setup',
  templateUrl: './data-setup.component.html',
  styleUrls: ['./data-setup.component.css']
})

export class DataSetupComponent extends BaseComponentComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  private datatableElement: DataTableDirective;
  @ViewChild('datasetupTable') datasetupTable: ElementRef;

  @ViewChild(NgForm, { static: false })
  private form: NgForm;

  @ViewChild(NgForm, { static: false })
  private typeForm: NgForm;
  errorReceived: boolean;
  public lookupVM: Lookup = new Lookup();
  public lookUpFilter: LookUpFilter = new LookUpFilter();
  public lookupTypeVM: LookupType = new LookupType();
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  public lookupResult: any;
  public authSubscription: Subscription;
  public selfComponent: any = this;
  isShown: boolean = false;
  isTypeShown: boolean = false;
  isAddButtonShow: boolean = false;
  isAddLookupButtonShow: boolean = true;
  id;
  isValid: boolean = true;
  isEditMode: boolean = false;
  isClientEditable: boolean = false;
  pageLayout = [];
  languageSubscription: Subscription;
  totalTimes = 0;
  public lookupTypes: any[];
  displayedColumns: any[];
  pagingType = 'full_numbers';
  pageLength = 10;

  constructor(public dialog: MatDialog,
    private notificationService: NotificationService,
    private dataSetupService: LookupDatasetupService,
    private multilingualPipe: MultilingualPipe,
    public securityService: SecurityService) {
    super(securityService, enumAccessOnPage.DataSetup);
  }

  ngOnInit(): void {
    this.bindAllLookupTypes();
    this.isEditMode = false;
    this.lookupVM.lookupTypeId = null;
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

  initializeDataTable(): void {
    const self = this;
    self.displayedColumns = [
      { title: this.multilingualPipe.transform('lblLookUpId', this.pageLayout), data: 'id' },
      { title: this.multilingualPipe.transform('lblLookUpName', this.pageLayout), data: 'name' },
      { title: this.multilingualPipe.transform('lblLookUpDisplayText', this.pageLayout), data: 'text' },
      { title: this.multilingualPipe.transform('lblLookUpAction', this.pageLayout), data: null, orderable: false },
    ];
    self.dtOptions = {
      pagingType: self.pagingType,
      pageLength: self.pageLength,
      processing: true,
      language: self.commonDtTypesLanguage,
      columns: this.displayedColumns,
      'columnDefs': [
        { width: "10%", className: "dt-body-center", targets: 0 },
        { width: "20%", targets: 1 },
        { width: "20%", targets: 2 },
        {
          render: function (data, type, row) {
            return self.actionTemplate;
          },
          width: "8%", targets: 3
        },
      ],
      searching: false,
      dom: 'Blfrtip',

      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('.remove-button', row).unbind('click');
        $('.remove-button', row).bind('click', () => {
          self.removeLookupItem(data);
        });
        $('.edit-button', row).unbind('click');
        $('.edit-button', row).bind('click', () => {
          self.editLookUpItem(data);
        });
        return row;
      },
      ajax: (dataTablesParameters: any, callback) => {
        var self = this;
        this.errorReceived = false;
        if (this.lookupVM.lookupTypeId > 0) {
          self.dataSetupService.getLookupsByTypeId(this.lookupVM.lookupTypeId).subscribe(response => {
            self.lookupResult = response;
            callback({
              data: response
            });
          }, error => {
            this.notificationService.printErrorMessage(this.multilingualPipe.transform('msgGettingDataSetupItemError', this.pageLayout));
          });
        }
      }
    };
  }

  // async getCommonDtOptionLanguages(): Promise<any> {
  //   const self = this;
  //   let selectedLanguage = { EntityNameFilter: "Datatable", languageIdFilter: parseInt(self.languageSelectedValue) };
  //   return new Promise((resolve) => {
  //     this.multilingualService.getAllMultilingualItem(selectedLanguage).subscribe((data: any) => {
  //       self.commonDtTypesLanguage = {
  //         emptyTable: self.multilingualPipe.transform('tblEmptyTable', data),
  //         info: self.multilingualPipe.transform('lblInfo', data),
  //         infoEmpty: self.multilingualPipe.transform('lblInfoEmpty', data),
  //         infoFiltered: self.multilingualPipe.transform('lblInfoFiltered', data),
  //         lengthMenu: self.multilingualPipe.transform('lblLengthMenu', data),
  //         loadingRecords: self.multilingualPipe.transform('lblLoadingRecords', data),
  //         processing: self.multilingualPipe.transform('lblProcessing', data),
  //         search: self.multilingualPipe.transform('lblSearch', data),
  //         zeroRecords: self.multilingualPipe.transform('lblZeroRecords', data),
  //         paginate: {
  //           first: self.multilingualPipe.transform('lblPaginate_first', data),
  //           last: self.multilingualPipe.transform('lblPaginate_last', data),
  //           next: self.multilingualPipe.transform('lblPaginate_next', data),
  //           previous: self.multilingualPipe.transform('lblPaginate_previous', data)
  //         },
  //         aria: {
  //           sortAscending: self.multilingualPipe.transform('lblAria_sortAscending', data),
  //           sortDescending: self.multilingualPipe.transform('lblAria_sortDescending', data)
  //         }
  //       };
  //       resolve(self.commonDtTypesLanguage);
  //     });
  //   });
  // }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.languageSubscription.unsubscribe();
  }

  reRender(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  filterLookupItenItem() {
    let filter = this.lookupResult;
    if (this.datatableElement.dtInstance) {
      this.reRender();
    }
    else {
      this.dtTrigger.next();
    }
  }

  hideForm() {
    let currentlookupTypeId = this.lookupVM.lookupTypeId;
    this.form.resetForm();
    this.resetLookupItem();
    this.lookupVM.lookupTypeId = currentlookupTypeId;
    this.isAddButtonShow = true;
    this.isShown = false;
    this.isEditMode = false;
    this.isAddLookupButtonShow = false;
    this.isTypeShown = false;
  }

  hideTypeform() {
    let currentlookupTypeId = this.lookupVM.lookupTypeId;
    this.typeForm.resetForm();
    this.resetLookupItem();
    this.lookupVM.lookupTypeId = currentlookupTypeId;
    this.isAddLookupButtonShow = true;
    this.isAddButtonShow = false;
    this.isTypeShown = false;
    this.isEditMode = false;
  }

  resetLookupItem() {
    let lookupVMNew = this.lookupVM
    this.lookupVM = new Lookup();
    this.lookupVM.lookupTypeId = lookupVMNew.lookupTypeId;
    this.lookupVM.isDelete = null;
  }

  resetLookupTypeItem() {
    this.lookupVM = new Lookup();
  }

  getLookupItemById(lookupTypeId): Promise<any> {
    var promise = new Promise((resolve, reject) => {
      this.dataSetupService.getLookupsByTypeId(lookupTypeId).subscribe(lookup => {
        resolve(lookup);
      })
    })
    return promise;
  }

  editLookUpItem(userdata) {
    let data = this.lookupResult.find(
      item => {
        return item.id == userdata.id
      }
    )
    this.lookupVM = {
      ID: data.id,
      lookupTypeId: data.lookupTypeId,
      name: data.name,
      text: data.text,
      value: data.value,
      displayOrder: data.displayOrder,
      alternateText: data.alternateText,
      parentLookupValueId: data.parentLookupValueId,
      isDelete: data.isDelete,
      booleanValue: data.booleanValue
    }
    this.isEditMode = true;
    this.hideAddButton(false);
  }

  bindAllLookupTypes() {
    this.dataSetupService.getAllLookupTypes().subscribe((response: any) => {
      if (response) {
        this.lookupTypes = response;
      }
    });
  }

  hideAddTypeButton(showHide) {
    this.isAddLookupButtonShow = showHide;
    this.isAddButtonShow = false;
    this.isTypeShown = true;
    this.isShown = false;
  }

  hideAddButton(showHide) {
    this.isAddButtonShow = showHide;
    this.isAddLookupButtonShow = false;
    this.isTypeShown = false;
    this.isShown = true;
  }

  onLookupTypeChange(): void {
    if (this.lookupVM.lookupTypeId > 0) {
      this.isAddButtonShow = true;
      this.isAddLookupButtonShow = false;
      this.resetLookupItem();
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
    else {
      this.isAddButtonShow = false;
      this.isAddLookupButtonShow = true;
    }
  }

  onSubmit() {
    this.saveLookupItem()
  }

  onLookUpSubmit() {
    if (this.lookupTypeVM.ID > 0) {
      this.putLookupTypeItem(this.lookupTypeVM);
    }
    else {
      this.postLookupTypeItem();
    }
  }

  postLookupTypeItem() {
    this.dataSetupService.postLookupType(this.lookupTypeVM).subscribe((data: any) => {
      this.notificationService.printSuccessMessage(this.multilingualPipe.transform('msgInsertItemSuccess', this.pageLayout));
      this.resetLookupTypeItem();
      this.hideTypeform();
      this.typeForm.form.markAsPristine();
      this.ngOnInit();
    }, error => {
      if (!!error.error && error.error.Message == StatusCode.Duplicate.toString())
        this.notificationService.printErrorMessage(this.multilingualPipe.transform('msgRecordAlreadyExists', this.pageLayout));
      else
        this.notificationService.printErrorMessage(this.multilingualPipe.transform('msgInsertItemError', this.pageLayout));
    });
  }

  putLookupTypeItem(data) {
    this.dataSetupService.putLookupType(data).subscribe((data: any) => {
      this.notificationService.printSuccessMessage(this.multilingualPipe.transform('msgUpdateItemSuccess', this.pageLayout));
      this.resetLookupTypeItem();
      this.hideTypeform();
      this.typeForm.form.markAsPristine();
      this.ngOnInit();
    },
      error => {
        if (!!error.error && error.error.Message == StatusCode.Duplicate.toString())
          this.notificationService.printErrorMessage(this.multilingualPipe.transform('msgRecordAlreadyExists', this.pageLayout));
        else
          this.notificationService.printErrorMessage(this.multilingualPipe.transform('msgUpdateItemError', this.pageLayout));
      }
    );
  }

  saveLookupItem() {
    if (this.lookupVM.ID > 0) {
      this.lookupVM.value = Number(this.lookupVM.value);
      this.lookupVM.displayOrder = Number(this.lookupVM.displayOrder);
      this.putLookupItem(this.lookupVM);
    }
    else {
      this.postLookupItem();
    }
  }

  postLookupItem() {
    this.lookupVM.value = Number(this.lookupVM.value);
    this.lookupVM.displayOrder = Number(this.lookupVM.displayOrder);
    this.dataSetupService.postLookup(this.lookupVM).subscribe((data: any) => {
      this.notificationService.printSuccessMessage(this.multilingualPipe.transform('msgInsertItemSuccess', this.pageLayout));
      this.resetLookupItem();
      this.hideForm();
      this.form.form.markAsPristine();
      this.onLookupTypeChange();

    }, error => {
      if (!!error.error && error.error.Message == StatusCode.Duplicate.toString())
        this.notificationService.printErrorMessage(this.multilingualPipe.transform('msgRecordAlreadyExists', this.pageLayout));
      else
        this.notificationService.printErrorMessage(this.multilingualPipe.transform('msgInsertItemError', this.pageLayout));
    });
  }

  putLookupItem(data) {
    this.dataSetupService.putLookup(data).subscribe(data => {
      this.notificationService.printSuccessMessage(this.multilingualPipe.transform('msgUpdateItemSuccess', this.pageLayout));
      this.resetLookupItem();
      this.hideForm();
      this.onLookupTypeChange();
      this.form.form.markAsPristine();
    },
      error => {
        if (!!error.error && error.error.Message == StatusCode.Duplicate.toString())
          this.notificationService.printErrorMessage(this.multilingualPipe.transform('msgRecordAlreadyExists', this.pageLayout));
        else
          this.notificationService.printErrorMessage(this.multilingualPipe.transform('msgUpdateItemError', this.pageLayout));
      }
    );
  }

  removeLookupItem(data) {
    const dialogRef = this.dialog.open(ConfirmationPopup, {
      width: '280px',
      data: {
        primaryId: data,
        subTitle: this.multilingualPipe.transform('msgDeleteConfirmation', this.pageLayout)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        data.isDelete = true;
        this.dataSetupService.deleteLookupItem(result).subscribe(data => {
          this.notificationService.printSuccessMessage(this.multilingualPipe.transform('msgDeleteItemSuccess', this.pageLayout));
          this.onLookupTypeChange();
        },
          error => {
            this.notificationService.printErrorMessage(this.multilingualPipe.transform('msgDeleteItemError', this.pageLayout));
          }
        );
        this.isEditMode = false;
        this.hideForm();
      }
    });
  }

}
