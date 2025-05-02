import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  const surveyId = '6c01c13d-5887-48de-86a6-b67d88b816e6' // or lookup dynamically
  const existing = await knex('surveys').where({ id: surveyId }).first()

  if (existing) {
    console.log('Survey already exists, skipping seed:', surveyId)
    return
  }

  const now = new Date().toISOString()

  const phq9Survey = {
    id: '6c01c13d-5887-48de-86a6-b67d88b816e6',
    title: 'PHQ-9',
    description: 'Patient Health Questionnaire-9',
    created_at: now,
    updated_at: now,
    deleted_at: null,
    metadata: {},
  }

  const likertLabels = {
    '0': 'Not at all',
    '1': 'Several days',
    '2': 'More than half the days',
    '3': 'Nearly every day',
  }

  const makeQuestion = (id: string, order: number, text: string) => ({
    id,
    survey_id: phq9Survey.id,
    text,
    question_type: 'likert',
    order,
    components: {
      min: 0,
      max: 3,
      labels: likertLabels,
      na_enabled: false,
    },
    created_at: now,
    updated_at: now,
    deleted_at: null,
    metadata: {},
  })

  const phq9Questions = [
    makeQuestion(
      'bf4ce0ee-6251-495d-8684-afdcf17bf6e0',
      1,
      'Little interest or pleasure in doing things',
    ),
    makeQuestion(
      'f6147c19-ff2f-44a1-815f-345c0e166676',
      2,
      'Feeling down, depressed, or hopeless',
    ),
    makeQuestion(
      '455bb660-ea21-4e52-bb90-7b31e54d5c72',
      3,
      'Trouble falling or staying asleep, or sleeping too much',
    ),
    makeQuestion(
      '17193cc5-9e87-41aa-870b-7cc5f6add06c',
      4,
      'Feeling tired or having little energy',
    ),
    makeQuestion(
      '7818772f-74ac-4950-afc9-4566788e26e1',
      5,
      'Poor appetite or overeating',
    ),
    makeQuestion(
      '2e0a3a46-dc28-495d-8151-bb07f802ee9d',
      6,
      'Feeling bad about yourself—or that you are a failure or have let yourself or your family down',
    ),
    makeQuestion(
      'b33e3d87-5c10-4018-9b65-49c97a101b26',
      7,
      'Trouble concentrating on things, such as reading the newspaper or watching television',
    ),
    makeQuestion(
      '07e1e8c2-0f76-4667-a5ff-749fd679d2b3',
      8,
      'Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
    ),
    makeQuestion(
      '7b8668f9-c26f-4e67-b79b-09de9e92c694',
      9,
      'Thoughts that you would be better off dead, or thoughts of hurting yourself in some way',
    ),
  ]

  await knex('surveys').insert(phq9Survey)
  await knex('questions').insert(phq9Questions)
}
