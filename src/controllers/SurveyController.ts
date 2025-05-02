// src/controllers/SurveyController.ts
import { Request, Response } from 'express'
import { Survey } from '../models/Survey'
import { Question } from '../models/Question'
import { RequestWithContext } from '../types/RequestWithContext'

export class SurveyController {
  static async list(req: Request, res: Response): Promise<void> {
    const surveys = await Survey.query()
    res.status(200).json(surveys)
  }

  static async get(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const survey = await Survey.query()
      .findById(id)
      .withGraphFetched('questions') as Survey & { questions: Question[] }

    if (!survey) {
      res.status(404).json({ error: 'Survey not found' })
      return
    }

    res.status(200).json(survey)
  }

  static async create(req: Request, res: Response): Promise<void> {
    const { title, description } = req.body
    const survey = await Survey.query().insert({ title, description })
    res.status(201).json(survey)
  }

  static async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { title, description } = req.body
    const survey = await Survey.query().patchAndFetchById(id, { title, description })

    if (!survey) {
      res.status(404).json({ error: 'Survey not found' })
      return
    }

    res.status(200).json(survey)
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const survey = await Survey.query().findById(id) as Survey

    if (!survey) {
      res.status(404).json({ error: 'Survey not found' })
      return
    }

    await survey.$softDelete()
    res.status(204).send()
  }
}
