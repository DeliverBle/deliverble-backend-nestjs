export class SearchCondition {
  constructor(_channel, _category, _announcerGender, _currentPage, _listSize) {
    this.channel = _channel;
    this.category = _category;
    this.announcerGender = _announcerGender;
    this.currentPage = _currentPage;
    this.listSize = _listSize;
  }
  // ["남자"] --> ["male"]
  channel: string[];
  category: string[];
  announcerGender: string[];
  currentPage: number | 1;
  listSize: number | 12;

  getOffset(): number {
    return (this.currentPage - 1) * this.listSize;
  }

  getLimit(): number {
    return this.listSize;
  }

  checkIfChannelIs(): boolean {
    if (this.channel.length === 0) {
      return false;
    }
    return true;
  }

  checkIfCategoryIs(): boolean {
    if (this.category.length === 0) {
      return false;
    }
    return true;
  }

  checkIfAnnouncerGenderIs(): boolean {
    if (this.announcerGender.length === 0) {
      return false;
    }
    return true;
  }

  checkFindAllOrNot(): boolean {
    if (!(this.checkIfChannelIs() || this.checkIfCategoryIs() || this.checkIfAnnouncerGenderIs())) {
      return true;
    }
    return false;
  }
}
