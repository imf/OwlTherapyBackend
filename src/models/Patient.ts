import { BaseModel } from './BaseModel'
import { User } from './User'

export class Patient extends BaseModel {
  userId!: string
  birthDate?: string
  location!: {
    country: string
    region?: string
  }
  status!: 'pending' | 'active' | 'inactive' | 'archived'

  static tableName = 'patients'

  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: { from: 'patients.userId', to: 'users.id' }
      }
    }
  }

  static get jsonSchema() {
    return this.createSchema(['userId', 'location', 'status'], {
      userId: { type: 'string', format: 'uuid' },
      birthDate: { type: ['string', 'null'], format: 'date' },
      location: {
        type: 'object',
        required: ['country'],
        properties: {
          country: { type: 'string', minLength: 2, maxLength: 2 },
          region: { type: 'string' }
        }
      },
      status: {
        type: 'string',
        enum: ['pending', 'active', 'inactive', 'archived']
      }
    })
  }
}
