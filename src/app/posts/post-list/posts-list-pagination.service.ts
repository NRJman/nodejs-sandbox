import { PaginationData, PaginationDataToUpdate } from 'src/app/shared/models/pagination-data.model';
import { Subject, Observable } from 'rxjs';

export class PostsListPaginationService {
    private _paginationData: PaginationData = {
        length: null,
        pageIndex: null,
        pageSize: null,
        previousPageIndex: null
    };

    public getPaginationData(): PaginationData {
        return {
            ...this._paginationData
        };
    }

    public updatePaginationData(data: PaginationDataToUpdate): void {
        this._paginationData = {
            ...this._paginationData,
            ...data
        };
    }
}
