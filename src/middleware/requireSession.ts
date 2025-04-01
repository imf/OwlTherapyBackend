import { Request, Response, NextFunction } from 'express';
import { Session } from '../models/Session';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { generateToken } from '../utils/tokenUtils';

export async function requireSession(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const auth = req.header('authorization');
  if (!auth) {
    res.status(401).json({ error: 'Missing ChainLink token' });
    return;
  }

  let token: string | undefined;

  if (auth.toLowerCase().startsWith('chainlink ')) {
    token = auth.substring('chainlink'.length).trim();
  } else if (auth.toLowerCase().startsWith('bearer ')) {
    token = auth.substring('bearer'.length).trim();
  }

  if (!token) {
    res.status(401).json({ error: 'Invalid ChainLink token' });
    return;
  }

  const session = await Session.query()
    .findOne((builder) =>
      builder.where('current_token', token).orWhere('previous_token', token)
    )
    .withGraphFetched('user.roles') as Session & { user: User & { roles: Role[] } };

  if (!session || session.deletedAt || session.expiresAt < new Date()) {
    res.status(401).json({ error: 'Session expired or invalid' });
    return;
  }

  if (session.currentToken === token) {
    session.previousToken = token;
    session.currentToken = generateToken('chainlink');
    session.expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await session.$query().patch({
      currentToken: session.currentToken,
      previousToken: session.previousToken,
      expiresAt: session.expiresAt,
      updatedAt: new Date(),
    });
    res.setHeader('X-Next-ChainLink-Token', session.currentToken);
  }

  // Safely cast and attach to context
  const reqWithContext = req as Request & {
    context: {
      session: Session;
      user: User;
      roles: string[];
    };
  };

  reqWithContext.context = {
    session,
    user: session.user!,
    roles: session.user?.roles?.map((r) => r.name) || [],
  };

  return next();
}
