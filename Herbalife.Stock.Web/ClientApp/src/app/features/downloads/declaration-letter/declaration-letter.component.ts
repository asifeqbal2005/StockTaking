import { Component, OnInit } from '@angular/core';
import { WmsInventoryService } from '../../../shared/services/wms-inventory.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import swal from 'sweetalert2';

@Component({
  selector: 'app-declaration-letter',
  templateUrl: './declaration-letter.component.html',
  styleUrls: ['./declaration-letter.component.css']
})
export class DeclarationLetterComponent implements OnInit {

  supervisorInventory: any[] = [];
  allInventory: any[] = [];
  rowFilterResult: any;
  pageSize: number = 10;
  downloadEnabled: boolean = false;

  constructor(private _wmsInventoryService: WmsInventoryService) {
    // Constructor code here
  }

  ngOnInit(): void {
    this.bindRowDataToFilter();
    this.loadInventoryDetails();
  }

  loadInventoryDetails() {
    this._wmsInventoryService.getSupervisorInventory().subscribe((data: any[]) => {
      this.allInventory = this.supervisorInventory = data;
    });
  }

  bindRowDataToFilter() {
    this._wmsInventoryService.getRowDataToFilter().subscribe((result: any) => {
      if (result != null) {
        this.rowFilterResult = result;
      }
    });
  }

  onRowDataSelected(rowData: any) {
    if (rowData.target.value == 'All') {
      this.allInventory = this.supervisorInventory;
    }
    else {
      this.allInventory = this.supervisorInventory.filter(o => o.row === rowData.target.value);
    }
  }

  onCheckboxChange() {
    this.downloadEnabled = this.allInventory.some(inv => inv.isChecked);
  }

  downloadRow(inv: any) {
    const doc = new jsPDF();
    doc.text('Declaration Letter', 10, 10);
    const startPage = new Date().toLocaleDateString();
    doc.text(`Date: ${startPage}`, 20, 20);
    doc.text('Signature:______________', 10, doc.internal.pageSize.height - 10);

    const headers = [['S.No', 'Location', 'Movible Unit', 'Sku', 'Description', 'Lot', 'Exp Date', 'Serial key', 'On Hand', 'Actual-A', 'Difference-A', 'Actual-B', 'Actual Final', 'Difference']];
    const rows = [[inv.sNo, inv.location, inv.movibleUnit, inv.sku, inv.description, inv.lot, inv.expdate, inv.serialkey, inv.onHand_WMS, inv.actualA, inv.diffA, inv.actualB, inv.actualFinal, inv.diffFinal]];
    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 30,
      theme: 'grid',
      styles: {
        cellPadding: 1,
        fontSize: 8
      }
    });

    swal.fire({
      title: 'Are you sure?',
      text: "want to download the file!",
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, download!',
      cancelButtonText: 'cancel download',
    }).then((result) => {
      if (result.isConfirmed) {
        doc.save('Declaration letter.pdf');
      }
    })
  }

  downloadData() {    
    const selectedItems = this.supervisorInventory.filter(inv => inv.isChecked);
    if (selectedItems.length === 0) {
      // Download all items
      const doc = new jsPDF();
      doc.text('Declaration Letter', 10, 10);
      const startPage = new Date().toLocaleDateString();
      doc.text(`Date: ${startPage}`, 20, 20);
      autoTable(doc, {
        head: [['SNo', 'Location', 'Movable Unit', 'Sku', 'Description', 'Lot', 'Exp Date', 'Serial key', 'OH WMS', 'Actual-A', 'Difference-A', 'Actual-B', 'Actual Final', 'Difference']],
        body: this.supervisorInventory.map(inv => [inv.sNo, inv.loc, inv.movibleUnit, inv.sku, inv.desc, inv.batchcode, inv.expdate, inv.serialkey, inv.onhand, inv.actualA, inv.diffA, inv.actualB, inv.actualFinal, inv.diffFinal]),
        startY: 30,
        styles: {
          cellPadding: 1,
          fontSize: 6
        }
      });
      swal.fire({
        title: 'Are you sure?',
        text: "want to download the file!",
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, download!',
        cancelButtonText: 'cancel download',
      }).then((result) => {
        if (result.isConfirmed) {
          doc.save('Declaration letter.pdf');
        }
      })
    }
    else {
      const doc = new jsPDF();
      doc.text('Declaration Letter', 10, 10);
      const startPage = new Date().toLocaleDateString();
      doc.text(`Date: ${startPage}`, 20, 20);
      doc.text('Signature:______________', 10, doc.internal.pageSize.height - 10);

      autoTable(doc, {
        head: [['SNo','Location','Movible Unit', 'Sku', 'Description', 'Lot', 'Exp Date', 'Serial key', 'On Hand', 'Actual-A', 'Difference-A', 'Actual-B', 'Actual Final', 'Difference']],
        body: selectedItems.map(inv => [inv.sNo, inv.location, inv.movibleUnit, inv.sku, inv.description, inv.lot, inv.expdate, inv.serialkey, inv.onHand_WMS, inv.actualA, inv.diffA, inv.actualB, inv.actualFinal, inv.diffFinal]),
        startY: 30,
        theme: 'grid',
        styles: {
          cellPadding: 1,
          fontSize: 6
        },
      });

      swal.fire({
        title: 'Are you sure?',
        text: "want to download the file!",
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, download!',
        cancelButtonText: 'cancel download',
      }).then((result) => {
        if (result.isConfirmed) {
          doc.save('Declaration letter.pdf');
        }
      })
      this.supervisorInventory.forEach(inv => inv.checked = false);
      this.downloadEnabled = false;
    }
  }

}
