// models/Question.ts
import { BaseModel } from './BaseModel'
import { Survey } from './Survey'
import { QuestionType } from './QuestionType'

export class Question extends BaseModel {
  static tableName = 'questions'

  surveyId!: string
  text!: string
  questionType!: string
  order!: number
  components!: Record<string, unknown>

  static get jsonSchema() {
    return this.createSchema(['surveyId', 'text', 'questionType', 'order'], {
      surveyId: { type: 'string', format: 'uuid' },
      text: { type: 'string' },
      questionType: { type: 'string' },
      order: { type: 'integer' },
      components: { type: 'object' },
    })
  }

  static relationMappings = {
    survey: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: Survey,
      join: {
        from: 'questions.survey_id',
        to: 'surveys.id',
      },
    },
    type: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: QuestionType,
      join: {
        from: 'questions.question_type',
        to: 'question_types.name',
      },
    },
  }
}
