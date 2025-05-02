// models/QuestionType.ts
import { BaseModel } from './BaseModel'

export class QuestionType extends BaseModel {
  static tableName = 'question_types'

  name!: string

  static get jsonSchema() {
    return this.createSchema(['name'], {
      name: { type: 'string' },
    })
  }
}
