import React from "react";
import PropTypes from "prop-types";
import "./index.css";

const Movie = (props) => (
  <div className="movie">
    <figure className="movie__figure">
      <li>
        <img
          src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1608195040354&di=0a0a71578184325200e01344b6b59402&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201407%2F03%2F20140703200728_Lt2MK.jpeg"
          className="movie__poster"
          alt=""
          onClick={() => props.onClickItem()}
        />

        {props.rating && (
          <figcaption>
            <span className="movie__vote">{props.rating}</span>
          </figcaption>
        )}
      </li>

      <h2 className="movie__title">{props.title} </h2>
      <p className="movie__runtime">{props.runtime}</p>
    </figure>
  </div>
);

Movie.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  poster_path: PropTypes.string,
  vote_average: PropTypes.number,
  onClickItem: PropTypes.func.isRequired,
};

export default Movie;
