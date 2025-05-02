// src/utils/dbUtils.ts

/**
 * Returns MySQL-formatted timestamp string for given Date
 */
export const toMySQLTimestamp = (date: Date | null): string | null => {
  if (!date) {
    return null
  }
  return (date as Date).toISOString().slice(0, 19).replace('T', ' ')
}

/**
 * Returns current time as MySQL-formatted timestamp string
 */
export const timestamp = (): string => {
  return toMySQLTimestamp(new Date()) as string
}

/**
 * Returns MySQL-formatted date string for current date
 */
export const date = (date: Date | null): string => {
  if (!date) {
    date = new Date()
  }
  return date.toJSON().slice(0, 10)
}

// Sugar to return a semantically clear 'today' value.
export const today = (): string => {
  return date(null)
}

/**
 * Returns MySQL-formatted timestamp string for X hours in the future
 */
export const futureDateMySQL = (hours: number): string => {
  return toMySQLTimestamp(
    new Date(Date.now() + hours * 60 * 60 * 1000),
  ) as string
}

/**
 * Returns PostgreSQL-formatted timestamp string for X hours in the future
 */
export const futureDatePostgreSQL = (hours: number): string => {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
}

// Use PostgreSQL for futureDate by default
export const futureDate = futureDatePostgreSQL

/**
 * Converts a MM/DD/YYYY string to a DB-friendly string representation
 */
export const convertDate = (dateString: string | null): String | null => {
  if (!dateString) {
    return null
  }
  const [month, day, year] = dateString.split('/')
  if (!month || !day || !year) {
    throw new Error('Invalid date format')
  }

  const paddedMonth = month.padStart(2, '0')
  const paddedDay = day.padStart(2, '0')
  const formattedDate = `${year}-${paddedMonth}-${paddedDay}`

  // Ensure it's a real date
  const isValidDate = !isNaN(Date.parse(formattedDate))
  if (!isValidDate) throw new Error('Invalid date value')

  return formattedDate
}
