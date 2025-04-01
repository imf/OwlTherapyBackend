import { Router } from 'express';
import { healthCheckHandler } from '../controllers/healthController';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Perform a health check
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *                 checks:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "checkDB"
 *                       status:
 *                         type: string
 *                         example: "ok"
 */
router.get('/health', healthCheckHandler);

export default router;
