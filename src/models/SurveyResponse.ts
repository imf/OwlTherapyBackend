// models/SurveyResponse.ts
import { BaseModel } from './BaseModel'
import { Survey } from './Survey'
import { User } from './User'
import { Answer } from './Answer'

export class SurveyResponse extends BaseModel {
  static tableName = 'survey_responses'

  surveyId!: string
  userId!: string
  survey?: Survey
  answers?: Answer[]

  static get jsonSchema() {
    return this.createSchema(['surveyId', 'userId'], {
      surveyId: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
    })
  }

  static relationMappings = {
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'survey_responses.user_id',
        to: 'users.id',
      },
    },
    survey: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: Survey,
      join: {
        from: 'survey_responses.survey_id',
        to: 'surveys.id',
      },
    },
    answers: {
      relation: BaseModel.HasManyRelation,
      modelClass: Answer,
      join: {
        from: 'survey_responses.id',
        to: 'answers.response_id',
      },
    },
  }
}
