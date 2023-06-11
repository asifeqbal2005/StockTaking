

export class Lookup {
  ID: number;
  lookupTypeId: number;
  name: string;
  text: string;
  value: number;
  displayOrder: number;
  alternateText: string;
  parentLookupValueId: number;
  isDelete: boolean;
  booleanValue: boolean;
}

export class LookupType {
  ID: number;
  name: string;
  Description: string;
  ClientEditable: boolean;
}

export class LookUpFilter {

  nameFilter: string;
  displayTextFilter: string;
  id: number
}
