import { Router } from 'express';
import { TokenController } from '../controllers/TokenController';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireAdmin } from '../middleware/requireAdmin';

const router = Router();

/**
 * @openapi
 * /tokens:
 *   get:
 *     summary: List tokens (admin only)
 *     tags: [Tokens]
 *     security:
 *       - ChainLinkAdminAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of tokens
 */
router.get('/', requireAdmin, asyncHandler(TokenController.list));

/**
 * @openapi
 * /tokens/{id}:
 *   delete:
 *     summary: Expire (soft-delete) a token
 *     tags: [Tokens]
 *     security:
 *       - ChainLinkAdminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Token expired
 */
router.delete('/:id', requireAdmin, asyncHandler(TokenController.expire));

export default router;
