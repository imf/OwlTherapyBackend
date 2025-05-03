// src/controllers/SurveyResponseController.ts
import { Request, Response } from 'express'
import { SurveyResponse } from '../models/SurveyResponse'
import { Answer } from '../models/Answer'
import { Question } from '../models/Question'
import { RequestWithContext } from '../types/RequestWithContext'
import { scoreSurveyResponse } from '../services/survey/scoreEngine'

export class SurveyResponseController {
  static async create(req: Request, res: Response): Promise<void> {
    const { surveyId, answers } = req.body
    const { context } = req as RequestWithContext
    const userId = context.session.userId

    if (!Array.isArray(answers)) {
      res.status(400).json({ error: 'Answers must be an array' })
      return
    }

    const response = (await SurveyResponse.query().insert({
      surveyId,
      userId,
    })) as SurveyResponse

    const answerInserts = answers.map((a: any) => ({
      responseId: response.id,
      questionId: a.questionId,
      value: a.value,
    }))

    await Answer.query().insert(answerInserts)

    res.status(201).json({ id: response.id })
  }

  static async get(req: Request, res: Response): Promise<void> {
    const { id } = req.params

    const response = (await SurveyResponse.query()
      .findById(id)
      .withGraphFetched(
        '[answers, answers.question, survey]',
      )) as SurveyResponse & {
      answers: (Answer & { question: Question })[]
    }

    if (!response) {
      res.status(404).json({ error: 'Survey response not found' })
      return
    }

    res.status(200).json(response)
  }

  static async score(req: Request, res: Response): Promise<void> {
    const { id } = req.params

    const response = (await SurveyResponse.query()
      .findById(id)
      .withGraphFetched('[survey, answers.question]')) as SurveyResponse & {
      survey: SurveyResponse['survey']
      answers: (Answer & { question: Question })[]
    }

    if (!response) {
      res.status(404).json({ error: 'Survey response not found' })
      return
    }

    try {
      const score = await scoreSurveyResponse(response)

      await SurveyResponse.query().patchAndFetchById(id, {
        metadata: {
          ...response.metadata,
          score,
        },
      })

      const updated = await SurveyResponse.query()
        .findById(id)
        .withGraphFetched('[survey, answers.question]')

      res.status(200).json(updated)
    } catch (err: any) {
      const status = err?.message?.includes('scorer_file') ? 503 : 500
      res.status(status).json({ error: err.message })
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params
  
    const response = await SurveyResponse.query().findById(id) as SurveyResponse
    if (!response) {
      res.status(404).json({ error: 'Survey response not found' })
      return
    }
  
    await response.$softDelete()
    res.status(204).end()
  }
  
  static async list(req: Request, res: Response): Promise<void> {
    const responses = await SurveyResponse.query()
      .withGraphFetched('[answers, answers.question, survey]')
      .orderBy('created_at', 'desc')
  
    res.status(200).json(responses)
  }
}
