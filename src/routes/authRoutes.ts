import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'

const router = Router()

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Signup a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, givenName, familyName]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               givenName: { type: string }
 *               familyName: { type: string }
 *               dob: { type: string, example: "MM/DD/YYYY" }
 *               login: { type: string }
 *     responses:
 *       201: { description: "User created successfully" }
 *       400: { description: "Missing required fields" }
 *       409: { description: "Login or email already registered." }
 *       500: { description: "Unexpected error" }
 */
router.post('/signup', AuthController.signup)

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, password]
 *             properties:
 *               identifier:
 *                  type: string
 *                  description: "User identifier, which can be either an email or a username."
 *                  example: "user@example.com or login/username"
 *               password:
 *                 type: string
 *                 description: "The cleartext user password."
 *                 example: "cleartext password"
 *     responses:
 *       200: { description: "Login successful" }
 *       401: { description: "Invalid credentials" }
 *       500: { description: "Unexpected error" }
 */
router.post('/login', AuthController.login)

export default router
