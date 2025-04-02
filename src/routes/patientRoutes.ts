import { Router } from 'express'
import { PatientController } from '../controllers/PatientController'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireAdmin } from '../middleware/requireAdmin'

const router = Router()

/**
 * @openapi
 * /patients:
 *   get:
 *     tags: [Patients]
 *     summary: List all patients
 *     security:
 *       - ChainLinkAdminAuth: []
 *     responses:
 *       200:
 *         description: A list of patients
 */
router.get('/', requireAdmin, asyncHandler(PatientController.list))

/**
 * @openapi
 * /patients:
 *   post:
 *     tags: [Patients]
 *     summary: Create a new patient
 *     security:
 *       - ChainLinkAdminAuth: []
 */
router.post('/', requireAdmin, asyncHandler(PatientController.create))

/**
 * @openapi
 * /patients/{id}:
 *   get:
 *     tags: [Patients]
 *     summary: Get patient by ID
 *     security:
 *       - ChainLinkAdminAuth: []
 */
router.get('/:id', requireAdmin, asyncHandler(PatientController.get))

/**
 * @openapi
 * /patients/{id}:
 *   patch:
 *     tags: [Patients]
 *     summary: Update patient by ID
 *     security:
 *       - ChainLinkAdminAuth: []
 */
router.patch('/:id', requireAdmin, asyncHandler(PatientController.update))

/**
 * @openapi
 * /patients/{id}:
 *   delete:
 *     tags: [Patients]
 *     summary: Delete patient by ID
 *     security:
 *       - ChainLinkAdminAuth: []
 */
router.delete('/:id', requireAdmin, asyncHandler(PatientController.delete))

export default router
