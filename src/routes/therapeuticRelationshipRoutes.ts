import { Router } from 'express'
import { TherapeuticRelationshipController } from '../controllers/TherapeuticRelationshipController'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireRole } from '../middleware/requireRole'

const router = Router()

/**
 * @openapi
 * /therapeutic-relationships:
 *   get:
 *     summary: List all therapeutic relationship
 *     tags: [Therapeutic Relationship]
 *     security:
 *       - ChainLinkRequireRole: []
 *     responses:
 *       200:
 *         description: List of therapeutic relationship
 */
router.get('/', requireRole('scheduler'), asyncHandler(TherapeuticRelationshipController.list))

/**
 * @openapi
 * /therapeutic-relationships/{id}:
 *   get:
 *     summary: Get a therapeutic relationship by ID
 *     tags: [Therapeutic Relationship]
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
 *         description: Therapeutic Relationship details
 *       404:
 *         description: Not found
 */
router.get('/:id', requireRole('scheduler'), asyncHandler(TherapeuticRelationshipController.get))

/**
 * @openapi
 * /therapeutic-relationships:
 *   post:
 *     summary: Create a new therapeutic relationship
 *     tags: [Therapeutic Relationship]
 *     security:
 *       - ChainLinkRequireRole: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TherapeuticRelationship'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', requireRole('scheduler'), asyncHandler(TherapeuticRelationshipController.create))

/**
 * @openapi
 * /therapeutic-relationships/{id}:
 *   put:
 *     summary: Update a therapeutic relationship
 *     tags: [Therapeutic Relationship]
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
 *             $ref: '#/components/schemas/TherapeuticRelationship'
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put('/:id', requireRole('scheduler'), asyncHandler(TherapeuticRelationshipController.update))

/**
 * @openapi
 * /therapeutic-relationships/{id}:
 *   delete:
 *     summary: Soft delete a therapeutic relationship
 *     tags: [Therapeutic Relationship]
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
router.delete('/:id', requireRole('scheduler'), asyncHandler(TherapeuticRelationshipController.remove))

export default router
