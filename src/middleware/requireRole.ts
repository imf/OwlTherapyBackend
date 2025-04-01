import { Request, Response, NextFunction } from 'express'
import { RequestWithContext } from '../types/RequestWithContext'

/**
 * Middleware to require a specific role in the request context.
 * Depends on useChainLink middleware to set the context.
 * @param requiredRole The role that is required for the request to proceed.
 * @returns A middleware function that checks if the user has the required role.
 * @throws 401 Unauthorized if the session is missing.
 * @throws 403 Forbidden if the user does not have the required role.
 */
export function requireRole(requiredRole: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { context } = req as RequestWithContext

    if (!context?.session) {
      res.status(401).json({ error: 'Unauthorized: missing session' })
      return
    }

    const roles = context.roles || []

    if (!roles.includes(requiredRole)) {
      res.status(403).json({ error: 'Forbidden: missing role' })
      return
    }

    next()
  }
}
// import { Request, Response, NextFunction } from 'express';
// import { requireSession } from './requireSession';
// import { RequestWithContext } from '../types/RequestWithContext';

// export function requireRole(requiredRole: string) {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     await requireSession(req, res, async (err?: any) => {
//       if (err) return next(err);

//       const { context } = req as RequestWithContext;
//       const roles = context?.roles || [];

//       if (!roles.includes(requiredRole)) {
//         return res.status(403).json({ error: 'Forbidden: missing role' });
//       }

//       return next();
//     });
//   };
// }
