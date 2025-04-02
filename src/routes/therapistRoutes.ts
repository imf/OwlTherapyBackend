import { Router } from 'express'
import { TherapistController } from '../controllers/TherapistController'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireAdmin } from '../middleware/requireAdmin'

const router = Router()

/**
 * @openapi
 * /therapists:
 *   get:
 *     tags: [Therapists]
 *     summary: List all therapists
 *     security:
 *       - ChainLinkAdminAuth: []
 *     responses:
 *       200:
 *         description: A list of therapists
 */
router.get('/', requireAdmin, asyncHandler(TherapistController.list))

/**
 * @openapi
 * /therapists:
 *   post:
 *     tags: [Therapists]
 *     summary: Create a new therapist
 *     security:
 *       - ChainLinkAdminAuth: []
 */
router.post('/', requireAdmin, asyncHandler(TherapistController.create))

/**
 * @openapi
 * /therapists/{id}:
 *   get:
 *     tags: [Therapists]
 *     summary: Get therapist by ID
 *     security:
 *       - ChainLinkAdminAuth: []
 */
router.get('/:id', requireAdmin, asyncHandler(TherapistController.get))

/**
 * @openapi
 * /therapists/{id}:
 *   patch:
 *     tags: [Therapists]
 *     summary: Update therapist by ID
 *     security:
 *       - ChainLinkAdminAuth: []
 */
router.patch('/:id', requireAdmin, asyncHandler(TherapistController.update))

/**
 * @openapi
 * /therapists/{id}:
 *   delete:
 *     tags: [Therapists]
 *     summary: Delete therapist by ID
 *     security:
 *       - ChainLinkAdminAuth: []
 */
router.delete('/:id', requireAdmin, asyncHandler(TherapistController.delete))

export default router
