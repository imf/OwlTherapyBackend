// models/Answer.ts
import { BaseModel } from './BaseModel'
import { SurveyResponse } from './SurveyResponse'
import { Question } from './Question'

export class Answer extends BaseModel {
  static tableName = 'answers'

  responseId!: string
  questionId!: string
  value!: Record<string, unknown>

  static get jsonSchema() {
    return this.createSchema(['responseId', 'questionId', 'value'], {
      responseId: { type: 'string', format: 'uuid' },
      questionId: { type: 'string', format: 'uuid' },
      value: { type: 'object' }, // JSONB
    })
  }

  static relationMappings = {
    response: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: SurveyResponse,
      join: {
        from: 'answers.response_id',
        to: 'survey_responses.id',
      },
    },
    question: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: Question,
      join: {
        from: 'answers.question_id',
        to: 'questions.id',
      },
    },
  }
}
