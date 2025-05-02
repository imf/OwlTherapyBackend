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
}
