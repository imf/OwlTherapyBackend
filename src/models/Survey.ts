// models/Survey.ts
import { BaseModel } from './BaseModel'
import { Question } from './Question'

export class Survey extends BaseModel {
  static tableName = 'surveys'

  title!: string
  description?: string

  static get jsonSchema() {
    return this.createSchema(['title'], {
      title: { type: 'string' },
      description: { type: 'string' },
    })
  }

  static relationMappings = {
    questions: {
      relation: BaseModel.HasManyRelation,
      modelClass: Question,
      join: {
        from: 'surveys.id',
        to: 'questions.survey_id',
      },
    },
  }
}
