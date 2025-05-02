import { SurveyResponse } from '../../../models/SurveyResponse'
import { Answer } from '../../../models/Answer'

export function phq9Score(response: SurveyResponse): { total: number } {
  const values = response.answers!.map((a: Answer) => {
    const selected = a.value?.selected
    return typeof selected === 'number' ? selected : 0
  })
  const total = values.reduce((sum, val) => sum + val, 0)
  return { total }
}
