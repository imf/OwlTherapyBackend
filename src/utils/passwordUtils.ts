import crypto from 'crypto'
import { PEPPER } from '../config/env'

export interface HashedPassword {
  salt: string
  hash: string
}

export const hashPassword = (password: string): string => {
  const salt: string = crypto.randomBytes(16).toString('hex')
  const hash: string = crypto
    .createHmac('sha512', PEPPER)
    .update(salt + password)
    .digest('hex')
  return `${salt}:${hash}`
}

export const verifyPassword = (
  password: string,
  passwordHash: string,
): boolean => {
  // Split the stored hash into its components
  const [salt, hash] = passwordHash.split(':')

  if (!salt || !hash) {
    return false
  }

  // Create a new hash using the stored salt
  const verifyHash = crypto
    .createHmac('sha512', PEPPER)
    .update(salt + password)
    .digest('hex')

  // Compare the hashes using a timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(hash, 'hex'),
    Buffer.from(verifyHash, 'hex'),
  )
}
