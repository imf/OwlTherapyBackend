import { BaseModel } from './BaseModel';
import { User } from './User';
import { Therapist } from './Therapist';
import { Patient } from './Patient'

export class TherapySession extends BaseModel {
  therapistId!: string
  clientIds!: string[]
  icd10Code?: string
  diagnosisCodes?: string[]
  sessionDate?: Date
  sessionTime?: Date
  sessionDuration?: number
  sessionType?: string
  sessionNotes?: string
  sessionStatus?: string

  static tableName = 'therapy_sessions'

  static get relationMappings() {

    return {
      therapist: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Therapist,
        join: { from: 'therapists.userId', to: 'users.id' }
      },
      clients: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Patient,
        join: {
          from: 'therapy_sessions.id',
          through: {
            from: 'clients_therapy_sessions.therapySessionId',
            to: 'clients_therapy_sessions.clientId',
            extra: ['createdAt']
          },
          to: 'users.id'
        }
      }
    }
  }

  static get jsonSchema() {
    return this.createSchema(['therapistSessionId'], {
      therapistId: { type: 'string', format: 'uuid' },
    })
  }
}
