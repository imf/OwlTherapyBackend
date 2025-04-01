import { Request, Response, NextFunction } from 'express'
import { Session } from '../models/Session'
import { User } from '../models/User'
import { Role } from '../models/Role'
import { generateToken } from '../utils/tokenUtils'

/**
 * The useChainLink middleware is used to refresh state from ChainLink.
 * It is intended to be used on all requests so that all user activity refreshes
 * both the session and the token.
 */
export async function useChainLink(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = getToken(req.header('authorization'))

  if (!token) {
    clearContext(req)
    return next()
  }

  const session = await Session.query()
    .findOne(builder =>
      builder.where('current_token', token).orWhere('previous_token', token)
    )
    .withGraphFetched('user.roles') as Session & { user: User & { roles: Role[] } }

  if (!session || session.deletedAt || session.expiresAt < new Date() || !session.user) {
    // console.debug(`Session not found or expired for token: ${token}: session: ${session}`)
    clearContext(req)
    return next()
  }

  if (session.currentToken === token) {
    // console.debug(`Refreshing ChainLink session to expire token ${token}`)
    // console.debug(`Old Session data: ${session.currentToken}, ${session.previousToken}, ${session.expiresAt}, ${session.deletedAt}`)
    session.previousToken = token
    session.currentToken = generateToken('chainlink')
    session.expiresAt = new Date(Date.now() + 15 * 60 * 1000)
    // console.debug(`New Session data: ${session.currentToken}, ${session.previousToken}, ${session.expiresAt}, ${session.deletedAt}`)

    await session.$query().patchAndFetch({
      currentToken: session.currentToken,
      previousToken: session.previousToken,
      expiresAt: session.expiresAt,
      updatedAt: new Date(),
    })

    // console.debug(`Session updated: ${session.currentToken}, ${session.previousToken}, ${session.expiresAt}, ${session.deletedAt}`)
  }
  res.setHeader('X-Next-ChainLink-Token', session.currentToken)

  setContext(req, session)
  return next()
}

/**
 * Attach a context object to the request.
 */
function setContext(
  req: Request,
  session: Session & { user: User & { roles: Role[] } }
): void {
  ;(req as any).context = {
    session,
    user: session.user,
    roles: session.user.roles?.map(r => r.name) ?? [],
  }
}

/**
 * Remove the context object if it exists.
 */
function clearContext(req: Request): void {
  delete (req as any).context
}

/**
 * Extract the token from the authorization header.
 * @param authHeader The authorization header.
 * @returns The token if present, otherwise undefined.
 */
function getToken(authHeader?: string): string | undefined {
  if (!authHeader) return undefined

  const lower = authHeader.toLowerCase()
  if (lower.startsWith('chainlink ')) {
    return authHeader.substring('chainlink'.length).trim()
  }

  if (lower.startsWith('bearer ')) {
    return authHeader.substring('bearer'.length).trim()
  }

  return undefined
}

/**
 * Rotate Token
 * This function is used to rotate the token and expire the old key.
 */
export async function rotateToken(session: Session): Promise<Session | undefined> {
  if (!session) {
    return undefined
  }
  session.previousToken = session.currentToken
  session.currentToken = generateToken('chainlink')
  session.expiresAt = new Date(Date.now() + 15 * 60 * 1000)
  // console.debug(`New Session data: ${session.currentToken}, ${session.previousToken}, ${session.expiresAt}, ${session.deletedAt}`)

  const updatedSession = await session.$query().patchAndFetch({
    currentToken: session.currentToken,
    previousToken: session.previousToken,
    expiresAt: session.expiresAt,
    updatedAt: new Date(),
  })

  return updatedSession
}

