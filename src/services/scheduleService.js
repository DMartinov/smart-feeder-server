import Schedule from "../models/schedule";
import ScheduleDto from "../dto/scheduleDto";

class ScheduleService {
    async getSchedule(deviceId) {
        const schedule = Schedule.find({deviceId});
        const dtos = schedule?.map(s => new ScheduleDto(s));
        return dtos;
    }

    async addSchedule(scheduleDto) {
        await Schedule.create(scheduleDto);
    }
}

export default new ScheduleService();
