import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { RequestWithContext } from '../types/RequestWithContext'

export function traceRequest(request: Request, response: Response, next: NextFunction): void {
  const incomingRequestId = request.headers['x-request-id']
  const traceId = typeof incomingRequestId === 'string' && incomingRequestId.length > 0
    ? incomingRequestId
    : uuidv4()

  const requestWithContext = request as RequestWithContext || {}

  requestWithContext.context.traceId = traceId

  response.setHeader('x-trace-id', traceId)

  next()
}
