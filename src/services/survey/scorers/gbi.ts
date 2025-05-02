import { SurveyResponse } from '../../../models/SurveyResponse'
import { Answer } from '../../../models/Answer'

export function gbiScore(response: SurveyResponse): { total: number } {
  if (!response.answers || !Array.isArray(response.answers)) {
    throw new Error('GBI scorer requires answers to be loaded')
  }
  const values = response.answers.map((a: Answer) => {
    const selected = a.value?.selected
    return typeof selected === 'number' ? selected : 0
  })
  const total = values.reduce((sum, val) => sum + val, 0)
  return { total }
}
