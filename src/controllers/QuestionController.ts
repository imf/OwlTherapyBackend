// src/controllers/QuestionController.ts
import { Request, Response } from 'express'
import { Question } from '../models/Question'

export class QuestionController {
  static async create(req: Request, res: Response): Promise<void> {
    const { surveyId } = req.params
    const { text, questionType, order, components } = req.body
    const question = await Question.query().insert({
      surveyId,
      text,
      questionType,
      order,
      components,
    })
    res.status(201).json(question)
  }

  static async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { text, questionType, order, components } = req.body
    const question = await Question.query().patchAndFetchById(id, {
      text,
      questionType,
      order,
      components,
    })

    if (!question) {
      res.status(404).json({ error: 'Question not found' })
      return
    }

    res.status(200).json(question)
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const question = (await Question.query().findById(id)) as Question

    if (!question) {
      res.status(404).json({ error: 'Question not found' })
      return
    }

    await question.$softDelete()
    res.status(204).send()
  }
}
