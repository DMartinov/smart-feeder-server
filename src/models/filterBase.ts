export default class FilterBase {
    get skip(): number {
        return this.page * this.pageSize;
    }

    constructor(public page: number = 0, public pageSize: number = 20) { }
}
