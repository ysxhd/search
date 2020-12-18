// type for responses through the API
export interface Person {
  id: string;
  name: string;

  movies: MovieSnippet[];
}

export type People = Person[];

export interface MovieSnippet {
    id: string;
    title: string;
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  runtime: number;
  genres: string[];
  rating: number;
  votes: number;

  directors?: People;
  writers?: People;
}

export type Movies = Movie[];

export interface Page {
  queryTime: number;
  total: number;
  count: number;
  avgRuntime: number;
  items: Movies;
}