import { Request, Response } from 'express'
import { TherapeuticRelationshipParticipant } from '../models/TherapeuticRelationshipParticipant'

export class TherapeuticRelationshipParticipantController {
  static async list(req: Request, res: Response): Promise<void> {
    const items = await TherapeuticRelationshipParticipant.query().whereNull('deleted_at') as TherapeuticRelationshipParticipant[]
    res.json(items)
  }

  static async get(req: Request, res: Response): Promise<void> {
    const item = await TherapeuticRelationshipParticipant.query().findById(req.params.id) as TherapeuticRelationshipParticipant
    if (!item || item.deletedAt) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.json(item)
  }

  static async create(req: Request, res: Response): Promise<void> {
    const item = await TherapeuticRelationshipParticipant.query().insert(req.body) as TherapeuticRelationshipParticipant
    res.status(201).json(item)
  }

  static async update(req: Request, res: Response): Promise<void> {
    const item = await TherapeuticRelationshipParticipant.query().patchAndFetchById(req.params.id, req.body) as TherapeuticRelationshipParticipant
    if (!item) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.json(item)
  }

  static async remove(req: Request, res: Response): Promise<void> {
    const item = await TherapeuticRelationshipParticipant.query().patchAndFetchById(req.params.id, {
      deletedAt: new Date(),
    }) as TherapeuticRelationshipParticipant
    if (!item) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.status(204).send()
  }
}
