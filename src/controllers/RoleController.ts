import { Request, Response } from 'express';
import { Role } from '../models/Role';
import { User } from '../models/User';
import { RequestWithContext } from '../types/RequestWithContext';

export class RoleController {
  static async list(req: Request, res: Response): Promise<void> {
    const roles = await Role.query();
    res.json(roles);
  }

  static async create(req: Request, res: Response): Promise<void> {
    const { name } = req.body;
    const role = await Role.query().insert({ name });
    res.status(201).json(role);
  }

  static async update(req: Request, res: Response): Promise<void> {
    const { name } = req.body;
    const role = await Role.query().patchAndFetchById(req.params.id, { name });
    res.json(role);
  }

  static async remove(req: Request, res: Response): Promise<void> {
    await Role.query().patch({ deletedAt: new Date() });
    res.status(204).end();
  }

  static async addUser(req: Request, res: Response): Promise<void> {
    const role = await Role.query().findById(req.params.id) as Role;
    const user = await User.query().findById(req.params.userId) as User;
    if (!role || !user) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    await user.$relatedQuery('roles').relate(role.id);
    res.status(204).end();
  }

  static async removeUser(req: Request, res: Response): Promise<void> {
    const user = await User.query().findById(req.params.userId) as User;
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    await user.$relatedQuery('roles').unrelate().where('role_id', req.params.id);
    res.status(204).end();
  }
}
