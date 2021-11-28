import { ObjectId } from 'mongoose';
import ScheduleDto from '../dto/scheduleDto';
import Schedule, { ISchedule } from '../models/data/schedule';

export default class ScheduleService {
    static async getSchedule(deviceId: ObjectId): Promise<Array<ScheduleDto>> {
        const schedule = await Schedule.find({ deviceId });
        const dtos = schedule?.map((s) => new ScheduleDto(s));
        return dtos;
    }

    static async addSchedule(scheduleDto: ScheduleDto): Promise<ISchedule> {
        return Schedule.create(scheduleDto);
    }
}
