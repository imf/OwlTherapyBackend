import { SurveyResponse } from '../../models/SurveyResponse'
import { phq9Score } from './scorers/phq9'
import { mdiScore } from './scorers/mdi'
import { gbiScore } from './scorers/gbi'
import { Answer } from '../../models/Answer'
import { Survey } from '../../models/Survey'

export async function scoreSurveyResponse(
  response: SurveyResponse,
): Promise<any> {
  if (!response.survey || !response.answers) {
    throw new Error(
      'scoreSurveyResponse requires answers and survey to be loaded',
    )
  }
  const surveyTitle = response.survey.title

  switch (surveyTitle) {
    case 'PHQ-9':
      return phq9Score(response)
    case 'MDI':
      return mdiScore(response)
    case 'GBI':
      return gbiScore(response)
    default:
      throw new Error(`No scoring rule defined for survey: ${surveyTitle}`)
  }
}
