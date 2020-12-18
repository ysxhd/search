import fs from 'fs';
import parse from 'csv-parse/lib/sync';
import { Movies, Movie, Person } from '../types/Movies';

// DB Types
interface MovieType {
  id: string;
  title: string;
  year: number;
  runtime: number;
  genres: string[];
  rating: number;
  votes: number;

  directorIds: string[];
  writerIds: string[];
}

interface PersonType {
  id: string;
  name: string;

  movieIds: string[];
}

type MoviesDBType = Map<string, MovieType>;
type PersonDBType = Map<string, PersonType>;

// record types
interface CrewRecord {
  tconst: string;
  directors: string;
  writers: string;
}

interface PersonRecord {
  nconst: string;
  primaryName: string;
}

interface MovieRecord {
  tconst: string;
  primaryTitle: string;
  startYear: string;
  runtimeMinutes: string;
  genres: string;
}

interface RatingsRecord {
  tconst: string;
  averageRating: string;
  numVotes: string;
}

// Index types for lookups
type StringIndexList = string[];
type IndexType = Map<string, StringIndexList>;

// In Memory Databases
const MoviesDB = new Map<string, MovieType>();
const PeopleDB = new Map<string, PersonType>();

// Indexes
const MovieIndex = new Map<string, StringIndexList>();
const MovieGenreIndex = new Map<string, StringIndexList>();
const PeopleNameIndex = new Map<string, StringIndexList>();

export const loadDBs = async (): Promise<void> => {
  const crewPath = './data/crew.tsv';
  const crewContents = fs.readFileSync(crewPath, { encoding: 'utf8' });
  const crewRecords = parse(crewContents, { columns: true, delimiter: '\t' });
  const peoplePath = './data/people.tsv';
  const peopleContents = fs.readFileSync(peoplePath, { encoding: 'utf8' });
  const peopleRecords = parse(peopleContents, { columns: true, delimiter: '\t' });
  const ratingsPath = './data/ratings.tsv';
  const ratingsContents = fs.readFileSync(ratingsPath, { encoding: 'utf8' });
  const ratingsRecords = parse(ratingsContents, { columns: true, delimiter: '\t' });
  const moviesPath = './data/movie_basics.tsv';
  const moviesContents = fs.readFileSync(moviesPath, { encoding: 'utf8' });
  const moviesRecords = parse(moviesContents, { columns: true, delimiter: '\t' });

  peopleRecords.forEach((peopleRecord: PersonRecord) => {
    PeopleDB.set(peopleRecord.nconst, {
      id: peopleRecord.nconst,
      name: peopleRecord.primaryName,
      movieIds: [],
    });
  });

  moviesRecords.forEach((record: MovieRecord) => {
    const movieRating = ratingsRecords.filter((ratingsRecord: RatingsRecord) => ratingsRecord.tconst === record.tconst);

    const movie: MovieType = {
      id: record.tconst,
      title: record.primaryTitle,
      genres: record.genres.toLowerCase().split(','),
      year: parseFloat(record.startYear),
      runtime: parseFloat(record.runtimeMinutes),
      rating: parseFloat(movieRating[0].averageRating || 0),
      votes: parseFloat(movieRating[0].numVotes || 0),
      directorIds: [],
      writerIds: [],
    };

    MoviesDB.set(movie.id, movie);
  });

  crewRecords.forEach((crewRecord: CrewRecord) => {
    const movieDirectorsIds: string[] = crewRecord.directors.split(',');
    const movieWritersIds: string[] = crewRecord.writers.split(',');

    // set the director and writer lists on the movies
    const movie: MovieType = MoviesDB.get(crewRecord.tconst);
    MoviesDB.set(crewRecord.tconst, {
      ...movie,
      directorIds: movieDirectorsIds,
      writerIds: movieWritersIds,
    });

    // set directors and writers movie participation
    movieDirectorsIds.forEach((directorId: string) => {
      const person: PersonType = PeopleDB.get(directorId);
      if (person != null) {
        PeopleDB.set(directorId, {
          ...person,
          movieIds: [...new Set([...(person.movieIds || []), crewRecord.tconst])],
        });
      }
    });

    movieWritersIds.forEach((writerId: string) => {
      const person: PersonType = PeopleDB.get(writerId);
      if (person != null) {
        PeopleDB.set(writerId, {
          ...person,
          movieIds: [...new Set([...(person.movieIds || []), crewRecord.tconst])],
        });
      }
    });
  });

  // setup indexes
  for (const [_, movie] of MoviesDB.entries()) {
    indexMovie(movie);
  }

  for (const [_, person] of PeopleDB.entries()) {
    indexPeople(person);
  }
};

const indexMovie = (movie: MovieType): void => {
  const { genres, id, title } = movie;

  // tokenize and index the movie id by the genre
  genres.forEach((genre: string) => {
    const stems = getTokenStems(genre);
    stems.forEach((stem: string) => {
      indexString(MovieGenreIndex, stem, id);
      indexString(MovieIndex, stem, id);
    });
  });

  // tokenize and index movie id by title for searchability
  const lowercasedTitle = title.toLowerCase();
  const replacedTitle = lowercasedTitle.replace(/[^a-z0-9\s]/, '');
  const splitTitle = replacedTitle.split(' ');
  splitTitle.forEach((token: string) => {
    // increases the size of the index, but that doesn't matter for our simple data set
    const stems = getTokenStems(token);
    stems.forEach((stem: string) => {
      indexString(MovieIndex, stem, id);
    });
  });
};

const indexPeople = (person: PersonType): void => {
  const { id, name, movieIds } = person;

  // tokenize and index person id by name for searchability
  const lowercasedName = name.toLowerCase();
  const replacedName = lowercasedName.replace(/[^a-z0-9]/, '');
  const splitName = replacedName.split(' ');
  splitName.forEach((token: string) => {
    // increases the size of the index, but that doesn't matter for our simple data set
    const stems = getTokenStems(token);
    stems.forEach((stem: string) => {
      indexString(PeopleNameIndex, stem, id);
      movieIds.forEach((movieId: string) => {
        indexString(MovieIndex, stem, movieId);
      });
    });
  });
};

const indexString = (index: IndexType, id: string, value: string): void => {
  const trimmedId = id.trim();
  const indexValues = [...(index.get(trimmedId) || []), value];

  index.set(trimmedId, indexValues);
};

// writing a query language in this would be too complicated so a simple function will work for now
export const filterMoviesByQuery = (q: string, sort: string, order: string): Movies => {
  let totalMovieIds: Set<string>;

  if (q != null && q.length) {
    // if the request filters the movie ids, then use the index to find document ids
    const tokens: string[] = q
      .trim()
      .toLowerCase()
      .split(' ');

    totalMovieIds = new Set(...tokens.map((token: string) => MovieIndex.get(token)));
  } else {
    // no filtering applied so grab all movie ids
    totalMovieIds = new Set(MoviesDB.keys());
  }

  // convert the movie ids to actual Movie objects
  const movies: Movies = [...totalMovieIds].map(getMovieById);

  if (order != null) {
    order = order.toLowerCase();
  }

  if (sort != null) {
    sort = sort.toLowerCase();
  }

  // desc = -1
  // asc = 1
  const sortOrder = order != null ? (order == 'asc' ? 1 : -1) : sort === 'title' ? 1 : -1;
  const sortField = sort === 'title' || sort === 'rating' ? sort : 'rating';
  // sorted by desc rating
  movies.sort((a: Movie, b: Movie) => {
    if (a[sortField] > b[sortField]) return sortOrder;
    if (a[sortField] < b[sortField]) return -1 * sortOrder;
    return 0;
  });

  return movies;
};

export const getMovieById = (id: string): Movie => {
  const movieType = MoviesDB.get(id);
  const directors = movieType.directorIds.map(getPersonById);
  const writers = movieType.writerIds.map(getPersonById);

  return {
    id: movieType.id,
    title: movieType.title,
    genres: movieType.genres,
    year: movieType.year,
    runtime: movieType.runtime,
    rating: movieType.rating,
    votes: movieType.votes,
    directors,
    writers,
  };
};

export const getPersonById = (id: string): Person => {
  const person = PeopleDB.get(id);
  const movies = person.movieIds.map((movieId: string) => {
    const movie = MoviesDB.get(movieId);
    return { id: movieId, title: movie.title };
  });

  return {
    id,
    name: person.name,
    movies,
  };
};

// exported for testing purposes
export const getTokenStems = (token: string, minStemLength = 2): string[] => {
  let stems: string[] = [token];

  if (token.length > minStemLength) {
    for (let stemSize = minStemLength; stemSize < token.length; stemSize++) {
      for (let i = 0; i <= token.length - stemSize; i++) {
        const stem = token.substring(i, i + stemSize);

        stems = [...stems, stem];
      }
    }
  }

  return [...new Set(stems)];
};
