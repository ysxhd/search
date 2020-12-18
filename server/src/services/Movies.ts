import { Movies, Movie, Page } from '../types/Movies';
import { filterMoviesByQuery, getMovieById } from '../db/DB';

export const filterMovies = (offset = 0, size = 10, query = '', sort = 'rating', order: string): Page => {
  if (typeof offset === 'string') {
    offset = parseInt(offset, 10);
  }

  if (typeof size === 'string') {
    size = parseInt(size, 10);
  }

  const start = Date.now();
  const movies = filterMoviesByQuery(query, sort, order);

  // page results returned through the API
  // this kind of thing would normally be handled within a database, but we're simulating a db with this code
  const limit = offset + 10;
  const moviesPage = movies.slice(offset, limit);

  // take end after slice to include the time it takes to grab the page, may be worth splitting this out to a different value
  const end = Date.now();

  return {
    queryTime: end - start,
    total: movies.length,
    avgRuntime: movies.reduce((acc: number, movie: Movie) => acc + movie.runtime, 0) / movies.length,
    count: moviesPage.length,
    items: moviesPage,
  };
};

export const getMovie = (id: string): Movie => getMovieById(id);
