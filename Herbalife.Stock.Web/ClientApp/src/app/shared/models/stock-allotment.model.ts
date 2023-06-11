export interface StockAllotmentModel {
  row: string
  operatorId1: number
  operatorId2: number
}

export interface StockOnHandModel {
  sNo: number
  location: string
  movibleUnit: string
  sku: string
  description: number
  lot: string
  expdate: string
  serialkey: string
  onHand_WMS: number
  actualA: number
  diffA: number
  actualB: number
  actualFinal: number
  diffFinal: number
}