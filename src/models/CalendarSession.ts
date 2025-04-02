import { BaseModel } from './BaseModel'

export class CalendarSession extends BaseModel {
  therapistId!: string
  recurrenceId?: string
  therapeuticRelationshipId?: string
  startTime!: string
  endTime!: string
  status!: string
  billingStatus?: string
  icd10Code?: string
  deliveryType!: string
  deliveryDetails!: Record<string, any>
  metadata!: Record<string, any>

  static get tableName() {
    return 'calendar_sessions'
  }

  static get jsonSchema() {
    return this.createSchema(['therapistId', 'startTime', 'endTime', 'status', 'deliveryType'], {
      therapistId: { type: 'string', format: 'uuid' },
      recurrenceId: { type: ['string', 'null'], format: 'uuid' },
      therapeuticRelationshipId: { type: ['string', 'null'], format: 'uuid' },
      startTime: { type: 'string', format: 'date-time' },
      endTime: { type: 'string', format: 'date-time' },
      status: { type: 'string' },
      billingStatus: { type: ['string', 'null'] },
      icd10Code: { type: ['string', 'null'] },
      deliveryType: { type: 'string' },
      deliveryDetails: { type: 'object' },
      metadata: { type: 'object' },
    })
  }
}
