import { TherapySession } from '../../../models/TherapySession'

export interface EHRAdapter {
  getTherapySession(patientId: string): Promise<TherapySession[]>
  pushTherapySession(session: TherapySession): Promise<void>
}
