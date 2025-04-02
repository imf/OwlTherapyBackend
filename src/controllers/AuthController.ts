import { Request, Response } from 'express';
import { User } from '../models/User';
import { verifyPassword, hashPassword } from '../utils/passwordUtils';
import { createSession } from '../utils/sessionUtils';

export class AuthController {
  /**
   * User signup — creates a new user and returns a session token
   */
  static async signup(req: Request, res: Response): Promise<void> {
    const {
      email,
      login,
      givenName,
      familyName,
      profilePhotoUrl,
      password,
      phone,
      metadata,
      birthDate,
      country,
      province,
      city,
      zip,
      address,
    } = req.body;
  
    const existing = await User.query().findOne((builder) =>
      builder.where('email', email).orWhere('login', login)
    );
  
    if (existing) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }
  
    const user = await User.query().insert({
      email,
      login,
      givenName,
      familyName,
      profilePhotoUrl: profilePhotoUrl,
      phone,
      birthDate,
      country,
      province,
      city,
      zip,
      address,
      passwordHash: hashPassword(password),
      metadata: metadata || {},
    }) as User;
  
    const session = await createSession(user.id); ;
  
    const { passwordHash, ...redactedUser } = user;
    res.status(201).json({
      userId: user.id,
      user: redactedUser,
      sessionId: session.id,
      token: session.currentToken,
    });
  }

  /**
   * User login — returns a session token if credentials are valid
   */
  static async login(req: Request, res: Response): Promise<void> {
    const { identifier, password } = req.body;
  
    const user = await User.query().findOne((builder) =>
      builder.where('email', identifier).orWhere('login', identifier)
    ) as User;
  
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
  
    const valid = verifyPassword(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
  
    const session = await createSession(user.id);
    const { passwordHash, ...redactedUser } = user;
    res.status(200).json({
      sessionId: session.id,
      user: redactedUser,
      token: session.currentToken,
    });
  }
}