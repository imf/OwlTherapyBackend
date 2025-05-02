import { BaseModel } from './BaseModel'

export class TherapistEducation extends BaseModel {
  therapistId!: string
  degree!: string // e.g., 'PsyD', 'PhD', 'MSW'
  fieldOfStudy!: string // e.g., 'Clinical Psychology', 'Counseling'
  institution!: string
  graduationYear?: number

  static tableName = 'therapist_education'

  static get relationMappings() {
    const { Therapist } = require('./Therapist')
    return {
      therapist: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Therapist,
        join: { from: 'therapist_education.therapistId', to: 'therapists.id' },
      },
    }
  }

  static get jsonSchema() {
    return this.createSchema(
      ['therapistId', 'degree', 'fieldOfStudy', 'institution'],
      {
        therapistId: { type: 'string', format: 'uuid' },
        degree: { type: 'string' },
        fieldOfStudy: { type: 'string' },
        institution: { type: 'string' },
        graduationYear: { type: ['integer', 'null'] },
      },
    )
  }
}
