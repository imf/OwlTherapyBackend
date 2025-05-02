export function getUrl(): string | null {
  const host = process.env.HOST
  const port = process.env.PORT
  const ssl = process.env.SSL

  if (!host || !port) {
    return null
  }

  const useSsl = ssl?.toLowerCase() === 'true'
  const protocol = useSsl ? 'https' : 'http'

  return `${protocol}://${host}:${port}/`
}
