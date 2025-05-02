import { SurveyResponse } from '../../../models/SurveyResponse'
import { Answer } from '../../../models/Answer'
import { Question } from '../../../models/Question'

interface MdiDiagnosis {
  rawScore: number
  diagnosis: 'No Depression' | 'Mild Depression' | 'Moderate Depression' | 'Severe Depression' | 'Unclear'
  icd10Code?: 'F32.0' | 'F32.1' | 'F32.2'
}

export function mdiScore(response: SurveyResponse): MdiDiagnosis {
  if (!response.answers) throw new Error('MDI scorer requires answers')
  const answers = response.answers as (Answer & { question: Question })[]

  const coreScores: number[] = []
  const allScores: number[] = []

  for (const answer of answers) {
    const score = answer.value?.selected
    const symptomClass = answer.question?.metadata?.symptom_class

    if (typeof score !== 'number') continue
    if (!symptomClass) continue

    allScores.push(score)
    if (symptomClass === 'core') {
      coreScores.push(score)
    }
  }

  const rawScore = allScores.reduce((sum, val) => sum + val, 0)

  // Core gating rule
  if (coreScores.length < 3 || coreScores.some(score => score < 2)) {
    return { rawScore, diagnosis: 'No Depression' }
  }

  const itemCount2plus = allScores.filter(score => score >= 2).length
  const itemCount3plus = allScores.filter(score => score >= 3).length

  if (itemCount2plus >= 4 && itemCount3plus >= 2) {
    return { rawScore, diagnosis: 'Severe Depression', icd10Code: 'F32.2' }
  } else if (itemCount2plus >= 4) {
    return { rawScore, diagnosis: 'Moderate Depression', icd10Code: 'F32.1' }
  } else if (itemCount2plus >= 2) {
    return { rawScore, diagnosis: 'Mild Depression', icd10Code: 'F32.0' }
  } else {
    return { rawScore, diagnosis: 'Unclear' }
  }
}
