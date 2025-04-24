import { Router } from 'express'
import { RecurrencePatternController } from '../controllers/RecurrencePatternController'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireRole } from '../middleware/requireRole'

const router = Router()

/**
 * @openapi
 * /recurrence-patterns:
 *   get:
 *     summary: List all recurrence pattern
 *     tags: [Recurrence Pattern]
 *     security:
 *       - ChainLinkRequireRole: []
 *     responses:
 *       200:
 *         description: List of recurrence pattern
 */
router.get('/', requireRole('scheduler'), asyncHandler(RecurrencePatternController.list))

/**
 * @openapi
 * /recurrence-patterns/{id}:
 *   get:
 *     summary: Get a recurrence pattern by ID
 *     tags: [Recurrence Pattern]
 *     security:
 *       - ChainLinkRequireRole: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Recurrence Pattern details
 *       404:
 *         description: Not found
 */
router.get('/:id', requireRole('scheduler'), asyncHandler(RecurrencePatternController.get))

/**
 * @openapi
 * /recurrence-patterns:
 *   post:
 *     summary: Create a new recurrence pattern
 *     tags: [Recurrence Pattern]
 *     security:
 *       - ChainLinkRequireRole: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecurrencePattern'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', requireRole('scheduler'), asyncHandler(RecurrencePatternController.create))

/**
 * @openapi
 * /recurrence-patterns/{id}:
 *   put:
 *     summary: Update a recurrence pattern
 *     tags: [Recurrence Pattern]
 *     security:
 *       - ChainLinkRequireRole: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecurrencePattern'
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put('/:id', requireRole('scheduler'), asyncHandler(RecurrencePatternController.update))

/**
 * @openapi
 * /recurrence-patterns/{id}:
 *   delete:
 *     summary: Soft delete a recurrence pattern
 *     tags: [Recurrence Pattern]
 *     security:
 *       - ChainLinkRequireRole: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete('/:id', requireRole('scheduler'), asyncHandler(RecurrencePatternController.remove))

export default router
