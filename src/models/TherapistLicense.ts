import { BaseModel } from './BaseModel'

export class TherapistLicense extends BaseModel {
  therapistId!: string
  licenseTitle!: string // e.g., 'Licensed Psychologist', 'LPC', 'LMFT'
  licenseNumber!: string
  issuingState!: string
  status!: 'active' | 'inactive' | 'expired' | 'revoked'
  issueDate?: string // ISO 8601 date
  expirationDate?: string // ISO 8601 date

  static tableName = 'therapist_licenses'

  static get relationMappings() {
    const { Therapist } = require('./Therapist')
    return {
      therapist: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Therapist,
        join: { from: 'therapist_licenses.therapistId', to: 'therapists.id' },
      },
    }
  }

  static get jsonSchema() {
    return this.createSchema(
      [
        'therapistId',
        'licenseTitle',
        'licenseNumber',
        'issuingState',
        'status',
      ],
      {
        therapistId: { type: 'string', format: 'uuid' },
        licenseTitle: { type: 'string' },
        licenseNumber: { type: 'string' },
        issuingState: { type: 'string' },
        status: {
          type: 'string',
          enum: ['active', 'inactive', 'expired', 'revoked'],
        },
        issueDate: { type: ['string', 'null'], format: 'date' },
        expirationDate: { type: ['string', 'null'], format: 'date' },
      },
    )
  }
}
