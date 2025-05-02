import { Request, Response } from 'express'
import { RecurrencePattern } from '../models/RecurrencePattern'

export class RecurrencePatternController {
  static async list(req: Request, res: Response): Promise<void> {
    const items = (await RecurrencePattern.query().whereNull(
      'deleted_at',
    )) as RecurrencePattern[]
    res.json(items)
  }

  static async get(req: Request, res: Response): Promise<void> {
    const item = (await RecurrencePattern.query().findById(
      req.params.id,
    )) as RecurrencePattern
    if (!item || item.deletedAt) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.json(item)
  }

  static async create(req: Request, res: Response): Promise<void> {
    const item = (await RecurrencePattern.query().insert(
      req.body,
    )) as RecurrencePattern
    res.status(201).json(item)
  }

  static async update(req: Request, res: Response): Promise<void> {
    const item = (await RecurrencePattern.query().patchAndFetchById(
      req.params.id,
      req.body,
    )) as RecurrencePattern
    if (!item) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.json(item)
  }

  static async remove(req: Request, res: Response): Promise<void> {
    const item = (await RecurrencePattern.query().patchAndFetchById(
      req.params.id,
      {
        deletedAt: new Date(),
      },
    )) as RecurrencePattern
    if (!item) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.status(204).send()
  }
}
