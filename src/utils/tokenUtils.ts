import config from '../config/config'

export const generateToken = (context: string, tenant?: string, length: number = 43): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const environment = config.environment
  let token;
  if (!tenant) {
    token = `${context}:${environment}:`
  } else {
    token = `${context}:${tenant}:${environment}:`
  }
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return token
}