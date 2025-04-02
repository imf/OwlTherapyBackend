import { Request, Response } from 'express'
import { Patient } from '../models/Patient'

export class PatientController {
  static async list(req: Request, res: Response) {
    try {
      const results = await Patient.query()
      res.json(results)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Unable to list patients' })
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const result = await Patient.query().findById(req.params.id)
      if (!result) return res.status(404).json({ error: 'Not found' })
      res.json(result)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Unable to retrieve patient' })
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const result = await Patient.query().insert(req.body)
      res.status(201).json(result)
    } catch (err) {
      console.error(err)
      res.status(400).json({ error: 'Invalid data or constraint violation' })
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const result = await Patient.query().patchAndFetchById(req.params.id, req.body)
      if (!result) return res.status(404).json({ error: 'Not found' })
      res.json(result)
    } catch (err) {
      console.error(err)
      res.status(400).json({ error: 'Invalid update or constraint violation' })
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await Patient.query().deleteById(req.params.id)
      if (!result) return res.status(404).json({ error: 'Not found' })
      res.status(204).end()
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Unable to delete patient' })
    }
  }
}
