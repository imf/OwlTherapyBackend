import { BaseModel } from './BaseModel'

export class Patient extends BaseModel {
  userId!: string

  name!: {
    given: string
    family: string
    middle?: string
    full?: string
  }

  contact!: {
    phone?: string
    email?: string
    address?: string
  }

  birthDate?: string // ISO 8601 date string

  location!: {
    country: string // ISO 3166-1 alpha-2
    region?: string
  }

  status!: 'pending' | 'active' | 'inactive' | 'archived'

  static tableName = 'patients'

  static get relationMappings() {
    const { User } = require('./User')
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: { from: 'patients.userId', to: 'users.id' }
      }
    }
  }

  static get jsonSchema() {
    return this.createSchema(['userId', 'name', 'location', 'status'], {
      userId: { type: 'string', format: 'uuid' },
      name: {
        type: 'object',
        required: ['given', 'family'],
        properties: {
          given: { type: 'string' },
          family: { type: 'string' },
          middle: { type: 'string' },
          full: { type: 'string' }
        }
      },
      contact: {
        type: 'object',
        properties: {
          phone: { type: 'string' },
          email: { type: 'string', format: 'email' },
          address: { type: 'string' }
        }
      },
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
