import HistoryDto from '../dto/historyDto.js';
import History from '../models/history.js';


class HistoryService {
    async getHistory(deviceId) {
        const history = History.find({deviceId});
        const historyDtos = history?.map(h => new HistoryDto(h));
        return historyDtos;
    }

    async addHistory(historyDto) {
        await History.create(historyDto);
    }
}

export default new HistoryService();