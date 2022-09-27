export class PaginationInfo {
  constructor(_totalCount: number, _lastPage: number) {
    this.totalCount = _totalCount;
    this.lastPage = _lastPage;
  }
  totalCount: number;
  lastPage: number;
}
