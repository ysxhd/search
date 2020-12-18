import React from "react";
import PropTypes from "prop-types";
import Movie from "../movie";

import "./index.css";

const Movies = (props) => (
  <ul className="movies">
    {props.movies.map((movie, index) => (
      <li key={movie.id}>
        <Movie {...movie} onClickItem={() => props.onClickItem(index)} />
      </li>
    ))}
  </ul>
);

Movies.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.object),
  onClickItem: PropTypes.func.isRequired,
};

export default Movies;
