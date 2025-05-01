// src/routes/therapySessionRoutes.ts
import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler'
import { TherapySessionController } from '../controllers/TherapySessionController'
import { requireRole } from '../middleware/requireRole'

const router = Router()

/**
 * @openapi
 * /therapy-sessions/{id}/push-to-ehr:
 *  post:
 *     summary: Push a therapy session to EHR
 *     tags: [Therapy Session]
 *     security:
 *        - ChainLinkRoleAuth: []
 */
router.post('/:id/push-to-ehr', requireRole('EHRAdmin'), asyncHandler(TherapySessionController.pushSession))

export default router
