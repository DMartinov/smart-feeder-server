import HistoryDto from '../dto/historyDto';

export default class HistoryService {
  #History;

  constructor(history) {
      this.#History = history;
  }

  async getHistory(deviceId) {
      const history = this.#History.find({ deviceId });
      const historyDtos = history?.map((h) => new HistoryDto(h));
      return historyDtos;
  }

  async addHistory(historyDto) {
      await this.#History.create(historyDto);
  }
}
