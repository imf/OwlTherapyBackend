import { Request, Response } from 'express'
import { TherapeuticRelationship } from '../models/TherapeuticRelationship'

export class TherapeuticRelationshipController {
  static async list(req: Request, res: Response): Promise<void> {
    const items = (await TherapeuticRelationship.query().whereNull(
      'deleted_at',
    )) as TherapeuticRelationship[]
    res.json(items)
  }

  static async get(req: Request, res: Response): Promise<void> {
    const item = (await TherapeuticRelationship.query().findById(
      req.params.id,
    )) as TherapeuticRelationship
    if (!item || item.deletedAt) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.json(item)
  }

  static async create(req: Request, res: Response): Promise<void> {
    const item = (await TherapeuticRelationship.query().insert(
      req.body,
    )) as TherapeuticRelationship
    res.status(201).json(item)
  }

  static async update(req: Request, res: Response): Promise<void> {
    const item = (await TherapeuticRelationship.query().patchAndFetchById(
      req.params.id,
      req.body,
    )) as TherapeuticRelationship
    if (!item) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.json(item)
  }

  static async remove(req: Request, res: Response): Promise<void> {
    const item = (await TherapeuticRelationship.query().patchAndFetchById(
      req.params.id,
      {
        deletedAt: new Date(),
      },
    )) as TherapeuticRelationship
    if (!item) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.status(204).send()
  }
}
