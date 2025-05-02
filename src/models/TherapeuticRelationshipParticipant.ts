import { BaseModel } from './BaseModel'

export class TherapeuticRelationshipParticipant extends BaseModel {
  relationshipId!: string
  userId!: string
  therapeuticRoleCode!: string
  metadata!: Record<string, any>

  static get tableName() {
    return 'therapeutic_relationship_participants'
  }

  static get jsonSchema() {
    return this.createSchema(
      ['relationshipId', 'userId', 'therapeuticRoleCode'],
      {
        relationshipId: { type: 'string', format: 'uuid' },
        userId: { type: 'string', format: 'uuid' },
        therapeuticRoleCode: { type: 'string', maxLength: 16 },
        metadata: { type: 'object' },
      },
    )
  }
}
