import express from 'express'
import UserController from '../controllers/UserController'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireAdmin } from '../middleware/requireAdmin'
import { requireChainLink } from '../middleware/requireChainLink'

const router = express.Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *         username:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         deletedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - ChainLinkAdminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [login, email, givenName, familyName]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               login:
 *                 type: string
 *               givenName:
 *                 type: string
 *               familyName:
 *                 type: string
 *               passwordHash:
 *                 type: string
 *                 nullable: true
 *               metadata:
 *                 type: object
 *                 default: {}
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/', requireAdmin, asyncHandler(UserController.createUser))

/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     summary: Get user details
 *     tags: [Users]
 *     security:
 *       - ChainLinkUserAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User details retrieved
 *       404:
 *         description: User not found
 */
router.get('/:userId', requireChainLink, asyncHandler(UserController.getUser))

/**
 * @openapi
 * /users/by-login/{login}:
 *   get:
 *     summary: Get user details
 *     tags: [Users]
 *     security:
 *       - ChainLinkUserAuth: []
 *     parameters:
 *       - name: login
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved
 *       404:
 *         description: User not found
 */
router.get(
  '/by-login/:login',
  requireChainLink,
  asyncHandler(UserController.getUserByLogin),
)

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     security:
 *       - ChainLinkAdminAuth: []
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', requireAdmin, UserController.getAllUsers)

/**
 * @openapi
 * /users/{userId}:
 *   patch:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - ChainLinkAdminAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               givenName:
 *                 type: string
 *               familyName:
 *                 type: string
 *               passwordHash:
 *                 type: string
 *                 nullable: true
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */
router.patch('/:userId', requireAdmin, UserController.updateUser)

/**
 * @openapi
 * /users/{userId}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - ChainLinkAdminAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete('/:userId', requireAdmin, UserController.deleteUser)

/**
 * @openapi
 * /users/check-login:
 *   post:
 *     summary: Check login availability
 *     tags: [Users]
 *     description: Checks if the desired login is available, and if not, returns a suggestion.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *             properties:
 *               login:
 *                 type: string
 *                 example: "johndoe"
 *     responses:
 *       200:
 *         description: Login is available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                   example: true
 *       409:
 *         description: Login is taken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                   example: false
 *                 suggestion:
 *                   type: string
 *                   example: "johndoe1"
 */
router.post('/check-login', asyncHandler(UserController.checkLogin))

export default router
