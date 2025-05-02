// TODO: Make this turn off details when in production

export const messageFrom = (error: any): string => {
  if (process.env.NODE_ENV === 'production') {
    // Production: Return a generic error message
    return 'An unexpected error occurred. Please try again later.'
  } else {
    // Development: Return the actual error message or type
    return error.message || error.name || 'An unexpected error occurred.'
  }
}
