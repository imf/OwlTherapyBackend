import { Model, QueryBuilder, Expression, snakeCaseMappers } from 'objection'
import { v4 as uuidv4 } from 'uuid'
import { timestamp } from '../utils/dbUtils'

export class BaseModel extends Model {
  static columnNameMappers = snakeCaseMappers()
  id!: string
  createdAt!: Date
  updatedAt!: Date
  deletedAt?: Date
  metadata?: Record<string, any> = {}

  // Helper for schema creation that all models will use
  static createSchema(required: string[], properties: object) {
    return {
      type: 'object',
      required,
      properties: {
        id: { type: 'string', format: 'uuid' },
        createdAt: {
          anyOf: [{ type: 'string', format: 'date-time' }, { type: 'object' }],
        },
        updatedAt: {
          anyOf: [{ type: 'string', format: 'date-time' }, { type: 'object' }],
        },
        deletedAt: {
          anyOf: [
            { type: 'string', format: 'date-time' },
            { type: 'object' },
            { type: 'null' },
          ],
        },
        ...properties,
      },
    }
  }

  // Helper for relation queries that need soft delete handling
  static relationModifier(query: QueryBuilder<any>) {
    const tableName = (query.modelClass() as typeof BaseModel).tableName
    query.whereNull(`${tableName}.deleted_at`)
  }

  // Lifecycle hooks
  $beforeInsert(): void {
    this.id = uuidv4()
    this.createdAt = new Date()
    this.updatedAt = new Date()
    if (!this.metadata) this.metadata = {}
  }

  $beforeUpdate(): void {
    this.updatedAt = new Date()
    if (!this.metadata) this.metadata = {}
  }

  // Soft delete helpers
  async $softDelete(): Promise<void> {
    await this.$query().patch({
      deletedAt: timestamp() as unknown as Expression<Date>,
    })
  }

  // Query modifiers
  static get modifiers() {
    return {
      notDeleted(query: QueryBuilder<any>) {
        const tableName = (query.modelClass() as typeof BaseModel).tableName
        query.whereNull(`${tableName}.deleted_at`)
      },
      withDeleted(query: QueryBuilder<any>) {
        // Do nothing, just override the notDeleted modifier
      },
    }
  }

  // Override the standard query to include notDeleted by default
  static query(...args: any[]) {
    return super.query(...args).modify('notDeleted')
  }
}
