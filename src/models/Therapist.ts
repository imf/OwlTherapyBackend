import { BaseModel } from './BaseModel';
import { User } from './User';
import { TherapistLicense } from './TherapistLicense';
import { TherapistEducation } from './TherapistEducation';

export class Therapist extends BaseModel {
  userId!: string
  npiNumber?: string
  // caqhNumber?: string
  // caqhStatus?: string
  // caqhLastUpdated?: Date
  specialties?: string[]
  bio?: string

  static tableName = 'therapists'

  static get relationMappings() {

    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: { from: 'therapists.userId', to: 'users.id' }
      },
      licenses: {
        relation: BaseModel.HasManyRelation,
        modelClass: TherapistLicense,
        join: { from: 'therapists.id', to: 'therapist_licenses.therapistId' }
      },
      education: {
        relation: BaseModel.HasManyRelation,
        modelClass: TherapistEducation,
        join: { from: 'therapists.id', to: 'therapist_education.therapistId' }
      }
    }
  }

  static get jsonSchema() {
    return this.createSchema(['userId'], {
      userId: { type: 'string', format: 'uuid' },
      npiNumber: { type: ['string', 'null'] },
      specialties: { type: ['array', 'null'], items: { type: 'string' } },
      bio: { type: ['string', 'null'] }
    })
  }
}
