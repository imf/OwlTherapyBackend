// src/routes/surveyRoutes.ts
import { Router } from 'express'
import { SurveyController } from '../controllers/SurveyController'

export const surveyRoutes = Router()

/**
 * @openapi
 * /surveys:
 *   get:
 *     summary: List all available surveys
 *     tags:
 *       - Surveys
 *     responses:
 *       200:
 *         description: A list of surveys
 */
surveyRoutes.get('/', SurveyController.list)

/**
 * @openapi
 * /surveys/{id}:
 *   get:
 *     summary: Get a survey with its questions
 *     tags:
 *       - Surveys
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The survey with its questions
 *       404:
 *         description: Survey not found
 */
surveyRoutes.get('/:id', SurveyController.get)
