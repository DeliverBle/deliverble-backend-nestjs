export class PaginationCondition {
  constructor(_currentPage, _listSize) {
    this.currentPage = _currentPage;
    this.listSize = _listSize;
  }

  currentPage: number | 1;
  listSize: number | 12;

  getOffset(): number {
    return (this.currentPage - 1) * this.listSize;
  }

  getLimit(): number {
    return this.listSize;
  }
}
