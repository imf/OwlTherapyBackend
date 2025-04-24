import { Request, Response } from 'express'
import { BillingRate } from '../models/BillingRate'

export class BillingRateController {
  static async list(req: Request, res: Response): Promise<void> {
    const items = await BillingRate.query().whereNull('deleted_at') as BillingRate[]
    res.json(items)
  }

  static async get(req: Request, res: Response): Promise<void> {
    const item = await BillingRate.query().findById(req.params.id) as BillingRate
    if (!item || item.deletedAt) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.json(item)
  }

  static async create(req: Request, res: Response): Promise<void> {
    const item = await BillingRate.query().insert(req.body) as BillingRate
    res.status(201).json(item)
  }

  static async update(req: Request, res: Response): Promise<void> {
    const item = await BillingRate.query().patchAndFetchById(req.params.id, req.body) as BillingRate
    if (!item) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.json(item)
  }

  static async remove(req: Request, res: Response): Promise<void> {
    const item = await BillingRate.query().patchAndFetchById(req.params.id, {
      deletedAt: new Date(),
    }) as BillingRate
    if (!item) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.status(204).send()
  }
}
