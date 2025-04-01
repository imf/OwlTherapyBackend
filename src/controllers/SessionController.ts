import { Request, Response } from 'express';
import { Session } from '../models/Session';
import { RequestWithContext } from '../types/RequestWithContext';

export class SessionController {
  static async list(req: Request, res: Response): Promise<void> {
    const reqWithContext = req as RequestWithContext;
    const sessions = await Session.query()
      .where('user_id', reqWithContext.context.user.id)
      .orderBy('created_at', 'desc');
    res.json(sessions);
  }

  static async revoke(req: Request, res: Response): Promise<void> {
    const reqWithContext = req as RequestWithContext;
    const session = await Session.query().findById(req.params.id) as Session;
    if (!session || session.userId !== reqWithContext.context.user.id) {
      res.status(403).json({ error: 'Forbidden' });
    }
    await session.$query().patch({ deletedAt: new Date() });
    res.status(204).end();
  }
}
