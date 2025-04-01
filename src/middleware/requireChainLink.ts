import { NextFunction, Request, Response } from 'express'
import { RequestWithContext } from '../types/RequestWithContext'

export function requireChainLink(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!(req as RequestWithContext).context?.session) {
    res.status(401).json({ error: 'Unauthorized: No valid ChainLink session.' })
    return
  }

  return next()
}