import { Router, Request, Response } from 'express';
import { filterMovies, getMovie } from '../services/Movies';

export const MoviesRouter = Router();

MoviesRouter.get(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    const { size = 10, offset = 0, sort = 'rating', order, query } = req.query;

    res.json(filterMovies(offset, size, query, sort, order));
  },
);

MoviesRouter.get(
  '/:id',
  async (req: Request, res: Response): Promise<void> => {
    res.json(getMovie(req.params.id));
  },
);
