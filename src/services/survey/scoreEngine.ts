import { SurveyResponse } from '../../models/SurveyResponse'

export async function scoreSurveyResponse(
  response: SurveyResponse
): Promise<Record<string, any>> {
  if (!response.survey) {
    throw new Error('Survey must be loaded on SurveyResponse')
  }
  
  const file = response.survey.metadata?.scorer_file
  if (!file) throw new Error('Missing `scorer_file` in survey metadata')

  const mod = await import(`./scorers/${file}`)
  const scorer = mod.default

  if (typeof scorer !== 'function') {
    throw new Error(`Scorer in ${file} does not export a default function`)
  }

  return scorer(response)
}
