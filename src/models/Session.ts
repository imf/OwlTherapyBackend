import { BaseModel } from "./BaseModel";
import { User } from "./User";

export class Session extends BaseModel {
  static tableName = "sessions";

  userId!: string;
  currentToken!: string;
  previousToken?: string;
  ipAddress?: string
  userAgent?: string
  expiresAt!: Date;

  user?: User;

  static get jsonSchema() {
    return this.createSchema(
      ['userId', 'currentToken'],
      {
        id: { type: 'string', format: 'uuid' },
        userId: { type: 'string', format: 'uuid' },
        currentToken: { type: 'string' },
        previousToken: { type: ['string', 'null'] },
        ipAddress: { type: ['string', 'null'] },
        userAgent: { type: ['string', 'null'] },
        expiresAt: {
          anyOf: [
            { type: 'string', format: 'date-time' },
            { type: 'object' }, // handles JS Date
          ],
        },
      }
    );
  }
  
  static relationMappings = {
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "sessions.user_id",
        to: "users.id",
      },
    },
  };
}
