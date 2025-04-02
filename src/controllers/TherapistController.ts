import { Request, Response } from 'express'
import { Therapist } from '../models/Therapist'

export class TherapistController {
  static async list(req: Request, res: Response) {
    try {
      const results = await Therapist.query()
      res.json(results)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Unable to list therapists' })
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const result = await Therapist.query().findById(req.params.id)
      if (!result) return res.status(404).json({ error: 'Not found' })
      res.json(result)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Unable to retrieve therapist' })
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const result = await Therapist.query().insert(req.body)
      res.status(201).json(result)
    } catch (err) {
      console.error(err)
      res.status(400).json({ error: 'Invalid data or constraint violation' })
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const result = await Therapist.query().patchAndFetchById(req.params.id, req.body)
      if (!result) return res.status(404).json({ error: 'Not found' })
      res.json(result)
    } catch (err) {
      console.error(err)
      res.status(400).json({ error: 'Invalid update or constraint violation' })
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await Therapist.query().deleteById(req.params.id)
      if (!result) return res.status(404).json({ error: 'Not found' })
      res.status(204).end()
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Unable to delete therapist' })
    }
  }
}
