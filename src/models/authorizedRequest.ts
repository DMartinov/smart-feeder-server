import { Request } from 'express';
import { IUserIdenity } from '../dto/identity';

export default interface AuthorizedRequest extends Request {
    user: IUserIdenity;
}
