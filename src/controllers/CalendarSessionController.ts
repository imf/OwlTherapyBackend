import { Request, Response } from 'express'
import { CalendarSession } from '../models/CalendarSession'

export class CalendarSessionController {
  static async list(req: Request, res: Response): Promise<void> {
    const items = (await CalendarSession.query().whereNull(
      'deleted_at',
    )) as CalendarSession[]
    res.json(items)
  }

  static async get(req: Request, res: Response): Promise<void> {
    const item = (await CalendarSession.query().findById(
      req.params.id,
    )) as CalendarSession
    if (!item || item.deletedAt) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.json(item)
  }

  static async create(req: Request, res: Response): Promise<void> {
    const item = (await CalendarSession.query().insert(
      req.body,
    )) as CalendarSession
    res.status(201).json(item)
  }

  static async update(req: Request, res: Response): Promise<void> {
    const item = (await CalendarSession.query().patchAndFetchById(
      req.params.id,
      req.body,
    )) as CalendarSession
    if (!item) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.json(item)
  }

  static async remove(req: Request, res: Response): Promise<void> {
    const item = (await CalendarSession.query().patchAndFetchById(
      req.params.id,
      {
        deletedAt: new Date(),
      },
    )) as CalendarSession
    if (!item) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.status(204).send()
  }
}
