import { ISchedule } from '../models/data/schedule';

export default class ScheduleDto {
    id;
    repeat;
    date;
    dateFrom;
    dateTo;
    portionSize;
    active;

    constructor(schedule: ISchedule) {
        this.id = schedule._id.toString();
        this.repeat = schedule.repeat;
        this.date = schedule.date;
        this.dateFrom = schedule.dateFrom;
        this.dateTo = schedule.dateTo;
        this.portionSize = schedule.portionSize;
        this.active = schedule.active;
    }
}
