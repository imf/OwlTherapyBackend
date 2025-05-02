import { Session } from '../models/Session'
import { generateToken } from '../utils/tokenUtils'

export async function createSession(userId: string): Promise<Session> {
  const token = generateToken('chainlink')
  return (await Session.query().insert({
    userId,
    currentToken: token,
    previousToken: null,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    metadata: {},
  })) as Session
}
