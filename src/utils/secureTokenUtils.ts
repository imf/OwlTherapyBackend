import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'
// import { Tenant } from '../models/Tenant';

/**
 * Generate a short, random nonce.
 */
export function generateNonce(): string {
  return crypto.randomBytes(3).toString('hex') // 6-character hex string
}

// /**
//  * Generate a secure transaction token in the format `<tenant>:<nonce>:<UUID>`.
//  * @param tenantIdentifier The unique identifier for the tenant (e.g., 'gamelife')
//  */
// export function generateTransactionToken(tenant: Tenant): string {
//   return `${tenant.shortIdentifier || tenant.identifier}:${generateNonce()}:${uuidv4()}`;
// }

/**
 * Validate and parse a transaction token.
 * @param token The token to validate.
 * @returns `{ valid: boolean, tenantIdentifier?: string, nonce?: string, transactionId?: string }`
 */
export function validateTransactionToken(token: string): {
  valid: boolean
  tenantIdentifier?: string
  nonce?: string
  transactionId?: string
} {
  const parts = token.split(':')

  if (parts.length !== 3) {
    return { valid: false }
  }

  const [tenantIdentifier, nonce, transactionId] = parts

  // ✅ Ensure tenant identifier is alphanumeric and not empty
  if (!/^[a-zA-Z0-9_-]+$/.test(tenantIdentifier)) {
    return { valid: false }
  }

  // ✅ Ensure nonce is a 6-character hex string
  if (!/^[a-f0-9]{6}$/.test(nonce)) {
    return { valid: false }
  }

  // ✅ Ensure transactionId is a valid UUID
  if (!/^[0-9a-fA-F-]{36}$/.test(transactionId)) {
    return { valid: false }
  }

  return { valid: true, tenantIdentifier, nonce, transactionId }
}
