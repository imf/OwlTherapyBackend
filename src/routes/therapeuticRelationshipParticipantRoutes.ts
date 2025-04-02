import { Router } from 'express'
import { TherapeuticRelationshipParticipantController } from '../controllers/TherapeuticRelationshipParticipantController'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireRole } from '../middleware/requireRole'

const router = Router()

/**
 * @openapi
 * /therapeutic-relationshipparticipants:
 *   get:
 *     summary: List all therapeutic relationship participant
 *     tags: [Therapeutic Relationship Participant]
 *     security:
 *       - ChainLinkRequireRole: []
 *     responses:
 *       200:
 *         description: List of therapeutic relationship participant
 */
router.get('/', requireRole('scheduler'), asyncHandler(TherapeuticRelationshipParticipantController.list))

/**
 * @openapi
 * /therapeutic-relationshipparticipants/{id}:
 *   get:
 *     summary: Get a therapeutic relationship participant by ID
 *     tags: [Therapeutic Relationship Participant]
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
 *         description: Therapeutic Relationship Participant details
 *       404:
 *         description: Not found
 */
router.get('/:id', requireRole('scheduler'), asyncHandler(TherapeuticRelationshipParticipantController.get))

/**
 * @openapi
 * /therapeutic-relationshipparticipants:
 *   post:
 *     summary: Create a new therapeutic relationship participant
 *     tags: [Therapeutic Relationship Participant]
 *     security:
 *       - ChainLinkRequireRole: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TherapeuticRelationshipParticipant'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', requireRole('scheduler'), asyncHandler(TherapeuticRelationshipParticipantController.create))

/**
 * @openapi
 * /therapeutic-relationshipparticipants/{id}:
 *   put:
 *     summary: Update a therapeutic relationship participant
 *     tags: [Therapeutic Relationship Participant]
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
 *             $ref: '#/components/schemas/TherapeuticRelationshipParticipant'
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put('/:id', requireRole('scheduler'), asyncHandler(TherapeuticRelationshipParticipantController.update))

/**
 * @openapi
 * /therapeutic-relationshipparticipants/{id}:
 *   delete:
 *     summary: Soft delete a therapeutic relationship participant
 *     tags: [Therapeutic Relationship Participant]
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
router.delete('/:id', requireRole('scheduler'), asyncHandler(TherapeuticRelationshipParticipantController.remove))

export default router
