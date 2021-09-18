import ScheduleDto from '../dto/scheduleDto';

export default class ScheduleService {
  #Schedule;

  constructor(schedule) {
      this.#Schedule = schedule;
  }

  async getSchedule(deviceId) {
      const schedule = this.#Schedule.find({ deviceId });
      const dtos = schedule?.map((s) => new ScheduleDto(s));
      return dtos;
  }

  async addSchedule(scheduleDto) {
      await this.#Schedule.create(scheduleDto);
  }
}
