import { User } from '../models/User'

export const redactUser = (user: User): Partial<User> => {
  return {
    ...user,
    id: redact(user.id),
    passwordHash: undefined,
  }
}

export const redactUserForSharing = (user: User): Partial<User> => {
  return {
    ...user,
    id: undefined,
    email: undefined,
    passwordHash: undefined,
    dob: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    deletedAt: undefined,
    metadata: undefined,
  }
}

/**
 * Redacts a string by showing only the first 6 characters and replacing the rest with 'X'
 * If string is 10 characters or less, it redacts the whole thing.
 * @param str The string to redact
 * @returns The redacted string
 */
export const redact = (str: string): string => {
  if (!str || str.length <= 10) return '*'.repeat(str.length)

  const visible = str.slice(0, 6)
  const hidden = '*'.repeat(str.length - 6)

  return visible + hidden
}

/**
 * Recursively redacts all values in a JSON object or array.
 * If a value is a string, it redacts it using the `redact` function.
 * Non-string values are left unchanged.
 * @param input The JSON object or array to redact
 * @returns A new JSON object or array with redacted values
 */
export const redactJson = (input: unknown): unknown => {
  if (typeof input === 'string') {
    return redact(input)
  }

  if (Array.isArray(input)) {
    return input.map((item) => redactJson(item))
  }

  if (input !== null && typeof input === 'object') {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) =>
        key.toLowerCase() === 'password'
          ? [key, '*****']
          : [key, redactJson(value)],
      ),
    )
  }

  // Non-string and non-object values are returned as-is
  return input
}
