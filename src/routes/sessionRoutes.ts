import { Router } from 'express'
import { SessionController } from '../controllers/SessionController'
import { requireChainLink } from '../middleware/requireChainLink'

const router = Router()

/**
 * @openapi
 * /sessions:
 *   get:
 *     summary: List active sessions for current user
 *     tags: [Sessions]
 *     security:
 *       - ChainLinkAdminAuth: []
 *     responses:
 *       200:
 *         description: Array of session objects
 */
router.get('/', requireChainLink, SessionController.list)

/**
 * @openapi
 * /sessions/{id}:
 *   delete:
 *     summary: Revoke a session (logout)
 *     tags: [Sessions]
 *     security:
 *       - ChainLinkAdminAuth: []
 *     responses:
 *       204:
 *         description: Session revoked
 */
router.delete('/:id', requireChainLink, SessionController.revoke)

export default router
