import { Router } from 'express';
import { RoleController } from '../controllers/RoleController';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireAdmin } from '../middleware/requireAdmin';

const router = Router();

/**
 * @openapi
 * /roles:
 *   get:
 *     summary: List all roles
 *     tags: [Roles]
 *     security:
 *       - ChainLinkAdminAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 */
router.get('/', requireAdmin, asyncHandler(RoleController.list));

/**
 * @openapi
 * /roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - ChainLinkAdminAuth: []
 */
router.post('/', requireAdmin, asyncHandler(RoleController.create));

/**
 * @openapi
 * /roles/{id}:
 *   put:
 *     summary: Rename a role
 *     tags: [Roles]
 *     security:
 *       - ChainLinkAdminAuth: []
 */
router.put('/:id', requireAdmin, asyncHandler(RoleController.update));

/**
 * @openapi
 * /roles/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
 *     security:
 *       - ChainLinkAdminAuth: []
 */
router.delete('/:id', requireAdmin, asyncHandler(RoleController.remove));

/**
 * @openapi
 * /roles/{id}/users/{userId}:
 *   post:
 *     summary: Add user to role
 *     tags: [Roles]
 *     security:
 *       - ChainLinkAdminAuth: []
 */
router.post('/:id/users/:userId', requireAdmin, asyncHandler(RoleController.addUser));

/**
 * @openapi
 * /roles/{id}/users/{userId}:
 *   delete:
 *     summary: Remove user from role
 *     tags: [Roles]
 *     security:
 *       - ChainLinkAdminAuth: []
 */
router.delete('/:id/users/:userId', requireAdmin, asyncHandler(RoleController.removeUser));

export default router;
