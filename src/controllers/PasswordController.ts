import { Request, Response } from 'express';
import { User } from '../models/User';
import { Token } from '../models/Token';
import { hashPassword } from '../utils/passwordUtils';
import { generateToken } from '../utils/tokenUtils';
import { addMinutes, isAfter } from 'date-fns';

export class PasswordController {
  static async requestReset(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    const user = await User.query().findOne({ email }) as User;

    if (!user) {
      res.status(404).json({ error: 'No account found for that email' });
    }

    const token = generateToken('pwreset');
    await Token.query().insert({
      userId: user.id,
      token,
      type: 'password_reset',
      expiresAt: addMinutes(new Date(), 15),
      metadata: {},
    });

    // TODO: Integrate with email provider to send the reset email
    console.log(`[DEBUG] Password reset token for ${email}: ${token}`);

    res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });
  }

  static async confirmReset(req: Request, res: Response): Promise<void> {
    const { token, newPassword } = req.body;

    const record = await Token.query()
      .where({ token })
      .andWhere('deleted_at', null)
      .first()
      .withGraphFetched('user') as Token & { user: User };

    if (!record || !record.user || isAfter(new Date(), record.expiresAt)) {
      res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    await record.user.$query().patch({
      passwordHash: hashPassword(newPassword),
      updatedAt: new Date(),
    });

    await record.$query().patch({ deletedAt: new Date() });

    res.status(200).json({ message: 'Password successfully reset' });
  }
}
