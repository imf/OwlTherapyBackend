// src/controllers/TherapistController.ts (add this or create TherapySessionController)

import { EHRService } from '../services/EHRService'
import { EpicClient } from '../services/ehr/clients/EpicClient'
import { Request, Response } from 'express'

export class TherapySessionController {
  static async pushSession(req: Request, res: Response) {
    const session = req.body // should be validated first
    const ehrService = new EHRService(new EpicClient())
    await ehrService.syncSession(session)
    res.status(204).end()
  }
}
