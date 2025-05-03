import path from 'path'
import { SurveyResponse } from '../../models/SurveyResponse'

export async function scoreSurveyResponse(
  response: SurveyResponse,
): Promise<unknown> {
  const metadata = response.survey?.metadata
  if (!metadata) throw new Error('Missing survey metadata')

  const file = metadata.scorer_file
  const scorerName = metadata.scorer_name

  if (!file) {
    throw new Error('Missing `scorer_file` in survey metadata')
  }

  // Resolve relative to the directory containing this file
  const filePath = path.resolve(__dirname, './scorers', file)

  let scorerModule
  try {
    scorerModule = await import(filePath)
  } catch (err) {
    throw new Error(`Failed to import scorer file '${file}': ${err}`)
  }

  const scorer =
    scorerName && scorerModule[scorerName]
      ? scorerModule[scorerName]
      : scorerModule.default

  if (typeof scorer !== 'function') {
    throw new Error(
      `Scorer in ${file} does not export a ${
        scorerName ? `function named ${scorerName}` : 'default function'
      }`,
    )
  }

  return scorer(response)
}
