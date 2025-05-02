import { Router } from 'express'
import { BillingRateController } from '../controllers/BillingRateController'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireRole } from '../middleware/requireRole'

const router = Router()

/**
 * @openapi
 * /billing-rates:
 *   get:
 *     summary: List all billing rate
 *     tags: [Billing Rate]
 *     security:
 *       - ChainLinkRequireRole: []
 *     responses:
 *       200:
 *         description: List of billing rate
 */
router.get(
  '/',
  requireRole('scheduler'),
  asyncHandler(BillingRateController.list),
)

/**
 * @openapi
 * /billing-rates/{id}:
 *   get:
 *     summary: Get a billing rate by ID
 *     tags: [Billing Rate]
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
 *         description: Billing Rate details
 *       404:
 *         description: Not found
 */
router.get(
  '/:id',
  requireRole('scheduler'),
  asyncHandler(BillingRateController.get),
)

/**
 * @openapi
 * /billing-rates:
 *   post:
 *     summary: Create a new billing rate
 *     tags: [Billing Rate]
 *     security:
 *       - ChainLinkRequireRole: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BillingRate'
 *     responses:
 *       201:
 *         description: Created
 */
router.post(
  '/',
  requireRole('scheduler'),
  asyncHandler(BillingRateController.create),
)

/**
 * @openapi
 * /billing-rates/{id}:
 *   put:
 *     summary: Update a billing rate
 *     tags: [Billing Rate]
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
 *             $ref: '#/components/schemas/BillingRate'
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put(
  '/:id',
  requireRole('scheduler'),
  asyncHandler(BillingRateController.update),
)

/**
 * @openapi
 * /billing-rates/{id}:
 *   delete:
 *     summary: Soft delete a billing rate
 *     tags: [Billing Rate]
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
  asyncHandler(BillingRateController.remove),
)

export default router
