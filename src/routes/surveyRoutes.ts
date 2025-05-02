// src/routes/surveyRoutes.ts
import { Router } from 'express'
import { SurveyController } from '../controllers/SurveyController'
import { QuestionController } from '../controllers/QuestionController'
import { requireAdmin } from '../middleware/requireAdmin'

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

/**
 * @openapi
 * /surveys:
 *   post:
 *     summary: Create a new survey
 *     tags: [Surveys]
 *     security:
 *       - ChainLinkAdminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
surveyRoutes.post('/', requireAdmin, SurveyController.create)

/**
 * @openapi
 * /surveys/{id}:
 *   put:
 *     summary: Update a survey
 *     tags: [Surveys]
 *     security:
 *       - ChainLinkAdminAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 */
surveyRoutes.put('/:id', requireAdmin, SurveyController.update)

/**
 * @openapi
 * /surveys/{id}:
 *   delete:
 *     summary: Delete a survey (soft delete)
 *     tags: [Surveys]
 *     security:
 *       - ChainLinkAdminAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted
 */
surveyRoutes.delete('/:id', requireAdmin, SurveyController.delete)

/**
 * @openapi
 * /surveys/{surveyId}/questions:
 *   post:
 *     summary: Add a question to a survey
 *     tags: [Questions]
 *     security:
 *       - ChainLinkAdminAuth: []
 *     parameters:
 *       - name: surveyId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Created
 */
surveyRoutes.post(
  '/:surveyId/questions',
  requireAdmin,
  QuestionController.create,
)
