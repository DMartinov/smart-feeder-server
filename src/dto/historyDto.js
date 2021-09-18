export default class HistoryDto {
    deviceId;
    date;
    portion;
    status;
    manual;
    message;
    userId;

    constructor(history) {
        this.deviceId = history.deviceId.toString();
        this.date = history.date;
        this.portion = history.portion;
        this.status = history.status;
        this.manual = history.manual;
        this.userId = history.userId;
    }
}
