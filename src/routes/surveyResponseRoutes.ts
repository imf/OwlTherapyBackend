// src/routes/surveyResponseRoutes.ts
import { Router } from 'express'
import { SurveyResponseController } from '../controllers/SurveyResponseController'
import { requireSession } from '../middleware/requireSession'
import { requireAdmin } from '../middleware/requireAdmin'

export const surveyResponseRoutes = Router()

/**
 * @openapi
 * /survey-responses:
 *   post:
 *     summary: Submit a survey response
 *     tags:
 *       - Survey Responses
 *     security:
 *       - ChainLinkUserAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [surveyId, answers]
 *             properties:
 *               surveyId:
 *                 type: string
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [questionId, value]
 *                   properties:
 *                     questionId:
 *                       type: string
 *                     value:
 *                       type: object
 *     responses:
 *       201:
 *         description: Survey response created
 */
surveyResponseRoutes.post('/', requireSession, SurveyResponseController.create)

/**
 * @openapi
 * /survey-responses/{id}:
 *   get:
 *     summary: Retrieve a submitted survey response
 *     tags:
 *       - Survey Responses
 *     security:
 *       - ChainLinkAdminAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Survey response with answers
 *       404:
 *         description: Not found
 */
surveyResponseRoutes.get('/:id', requireAdmin, SurveyResponseController.get)
