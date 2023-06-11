import { Component, OnInit, ViewChild } from '@angular/core';
import { WmsInventoryService } from '../../../shared/services/wms-inventory.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-wms-inventory',
  templateUrl: './wms-inventory.component.html',
  styleUrls: ['./wms-inventory.component.css']
})
export class WmsInventoryComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  allInventory: any;
  rowFilterResult: any;
  pageSize: number = 10;
  p: number = 1;

  constructor(private _wmsInventoryService: WmsInventoryService) { }

  ngOnInit(): void {
    this.bindRowDataToFilter();
    this.loadInventoryDetails();
  }

  bindRowDataToFilter(){
    this._wmsInventoryService.getRowDataToFilter().subscribe((result: any)=>{
      if(result != null){
        this.rowFilterResult = result;
      }
    });
  }

  loadInventoryDetails() {    
    this.allInventory = this._wmsInventoryService.BindInventoryDetails();
  }

  uploadFile() {
    let formData = new FormData();
    formData.append('fileDetails', this.fileInput.nativeElement.files[0])

    this._wmsInventoryService.UploadExcel(formData).subscribe((result: any) => {
      if (result) {
        this.loadInventoryDetails();
      }
    });
  }

  onRowDataSelected(rowData: any)
  {    
    this.allInventory = this._wmsInventoryService.BindInventoryDetails().pipe(
      map(data => data.filter(p => p.row === rowData.target.value))
    );    
  }

}
