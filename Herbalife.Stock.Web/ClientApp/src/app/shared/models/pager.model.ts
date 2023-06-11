export interface IPager {
  totalItems: number;
  itemsPerPage: number;
  actualPage: number;
  totalPages: number;
  previous: string;
  next: string;
}
