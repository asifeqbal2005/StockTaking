export class InventoryModel 
{
    id!: number;
    date!: Date;    
    subinventory!: string;
    chamber!: string;
    level!: string;
    sNo!: number;
    form!: string;
    storerkey!: string;
    loc!: string;
    movibleUnit!: string;
    sku!: string;
    desc!: string;
    batchcode!: string;
    expdate!: string;
    busr10!: string;
    remarks!: string;
    sectionkey!: string;
    row!: string;
    serialkey!: string;
    onhand!: number;
    allocated!: number;
    picked!: number;
    available!: number;
    actualA!: number;
    diffA!: number;
    actualB!: number;
    actualFinal!: number;
    diffFinal!: number;
    isEdit: false = false;
    isDelete!: boolean;
    createdBy!: number;
    createdDate!: Date;
    updatedBy!: number;
    updatedDate!: Date;    
}