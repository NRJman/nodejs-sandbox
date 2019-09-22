export interface PaginationData {
    length: number;
    pageIndex: number;
    pageSize: number;
    previousPageIndex: number;
}

export interface PaginationDataToUpdate {
    length?: number;
    pageIndex?: number;
    pageSize?: number;
    previousPageIndex?: number;
}
