import { Router, Request, Response } from 'express';
import { getPerson } from '../services/Crew';

export const CrewRouter = Router();

CrewRouter.get(
  '/:id',
  async (req: Request, res: Response): Promise<void> => {
    res.json(getPerson(req.params.id));
  },
);
