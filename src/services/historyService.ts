import { ObjectId } from 'mongoose';
import History, { IHistory } from '../models/data/history';
import HistoryDto from '../dto/historyDto';

export default class HistoryService {
    static async getHistory(deviceId: ObjectId): Promise<Array<HistoryDto>> {
        const history = await History.find({ deviceId });
        const historyDtos = history?.map((h) => new HistoryDto(h));
        return historyDtos;
    }

    static async addHistory(historyDto: HistoryDto): Promise<IHistory> {
        return History.create(historyDto);
    }
}
