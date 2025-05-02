import { Router } from 'express'
import { PasswordController } from '../controllers/PasswordController'
import { asyncHandler } from '../middleware/asyncHandler'

const router = Router()

/**
 * @openapi
 * /password/reset-password:
 *   post:
 *     summary: Request a password reset
 *     tags: [Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent if account exists
 */
router.post('/reset-password', asyncHandler(PasswordController.requestReset))

/**
 * @openapi
 * /password/reset-password/confirm:
 *   post:
 *     summary: Confirm password reset with token
 *     tags: [Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password successfully updated
 */
router.post(
  '/reset-password/confirm',
  asyncHandler(PasswordController.confirmReset),
)

export default router
