import { Router } from 'express'
import { CalendarSessionController } from '../controllers/CalendarSessionController'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireRole } from '../middleware/requireRole'

const router = Router()

/**
 * @openapi
 * /calendar-sessions:
 *   get:
 *     summary: List all calendar session
 *     tags: [Calendar Session]
 *     security:
 *       - ChainLinkRequireRole: []
 *     responses:
 *       200:
 *         description: List of calendar session
 */
router.get(
  '/',
  requireRole('scheduler'),
  asyncHandler(CalendarSessionController.list),
)

/**
 * @openapi
 * /calendar-sessions/{id}:
 *   get:
 *     summary: Get a calendar session by ID
 *     tags: [Calendar Session]
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
 *         description: Calendar Session details
 *       404:
 *         description: Not found
 */
router.get(
  '/:id',
  requireRole('scheduler'),
  asyncHandler(CalendarSessionController.get),
)

/**
 * @openapi
 * /calendar-sessions:
 *   post:
 *     summary: Create a new calendar session
 *     tags: [Calendar Session]
 *     security:
 *       - ChainLinkRequireRole: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CalendarSession'
 *     responses:
 *       201:
 *         description: Created
 */
router.post(
  '/',
  requireRole('scheduler'),
  asyncHandler(CalendarSessionController.create),
)

/**
 * @openapi
 * /calendar-sessions/{id}:
 *   put:
 *     summary: Update a calendar session
 *     tags: [Calendar Session]
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
 *             $ref: '#/components/schemas/CalendarSession'
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put(
  '/:id',
  requireRole('scheduler'),
  asyncHandler(CalendarSessionController.update),
)

/**
 * @openapi
 * /calendar-sessions/{id}:
 *   delete:
 *     summary: Soft delete a calendar session
 *     tags: [Calendar Session]
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
router.delete(
  '/:id',
  requireRole('scheduler'),
  asyncHandler(CalendarSessionController.remove),
)

export default router
