import { User } from '../models/User'
import { Request, Response } from 'express'

// Define a type for health check results
type HealthCheckResult = {
  name: string
  status: 'ok' | 'error'
  error?: string
}

// Simple check that always passes
async function checkSimple(): Promise<HealthCheckResult> {
  return { name: 'checkSimple', status: 'ok' }
}

// Database connectivity check
async function checkDB(): Promise<HealthCheckResult> {
  try {
    await User.query().first() // Attempt to fetch a single record
    return { name: 'checkDB', status: 'ok' }
  } catch (error) {
    return { name: 'checkDB', status: 'error', error: (error as Error).message }
  }
}

// Main health check function
async function healthCheck(): Promise<{
  status: 'ok' | 'error'
  checks: Record<string, HealthCheckResult>
}> {
  const checks: (() => Promise<HealthCheckResult>)[] = [checkSimple, checkDB] // Add more checks here in the future
  const results: Record<string, HealthCheckResult> = {}
  let isHealthy = true

  for (const check of checks) {
    const result = await check()
    results[result.name] = result
    if (result.status !== 'ok') {
      isHealthy = false
    }
  }

  return {
    status: isHealthy ? 'ok' : 'error',
    checks: results,
  }
}

// Express route handler
export async function healthCheckHandler(req: Request, res: Response) {
  const result = await healthCheck()
  res.status(result.status === 'ok' ? 200 : 500).json(result)
}
