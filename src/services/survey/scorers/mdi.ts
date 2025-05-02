import { SurveyResponse } from '../../../models/SurveyResponse'
import { Answer } from '../../../models/Answer'

export function mdiScore(response: SurveyResponse): {
  total: number
  average: number
} {
  if (!response.answers || !Array.isArray(response.answers)) {
    throw new Error('MDI scorer requires answers to be loaded')
  }
  const values = response.answers.map((a: Answer) => {
    const selected = a.value?.selected
    return typeof selected === 'number' ? selected : 0
  })
  const total = values.reduce((sum, val) => sum + val, 0)
  const average = values.length > 0 ? total / values.length : 0
  return { total, average }
}
