import { Request } from 'express';
import { Session } from '../models/Session';
import { User } from '../models/User';

export interface RequestWithContext extends Request {
  context: {
    traceId?: string;
    session: Session;
    user: User;
    roles: string[];
  };
}
