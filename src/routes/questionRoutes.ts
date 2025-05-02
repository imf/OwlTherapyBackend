import { Router } from 'express'
import { QuestionController } from '../controllers/QuestionController'
import { requireAdmin } from '../middleware/requireAdmin'

export const questionRoutes = Router()

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
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Created
 */
questionRoutes.post(
  '/:surveyId/questions',
  requireAdmin,
  QuestionController.create
)

/**
 * @openapi
 * /questions/{id}:
 *   put:
 *     summary: Update a question
 *     tags: [Questions]
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
questionRoutes.put('/:id', requireAdmin, QuestionController.update)

/**
 * @openapi
 * /questions/{id}:
 *   delete:
 *     summary: Delete a question (soft delete)
 *     tags: [Questions]
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
questionRoutes.delete('/:id', requireAdmin, QuestionController.delete)
