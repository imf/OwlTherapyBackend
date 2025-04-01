import { Request, Response } from 'express';
import { Token } from '../models/Token';
import { RequestWithContext } from '../types/RequestWithContext';

export class TokenController {
  static async list(req: Request, res: Response): Promise<void> {
    // const reqWithContext = req as RequestWithContext;
    const { type, userId } = req.query;

    let query = Token.query().whereNull('deleted_at');

    if (type) {
      query = query.where('type', type.toString());
    }

    if (userId) {
      query = query.where('user_id', userId.toString());
    }

    const tokens = await query.orderBy('created_at', 'desc');
    res.json(tokens);
  }

  static async expire(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const token = await Token.query().findById(id) as Token;
    if (!token || token.deletedAt) {
      res.status(404).json({ error: 'Token not found or already expired' });
      return
    }

    await token.$query().patch({ deletedAt: new Date() });
    res.status(204).end();
  }
}
