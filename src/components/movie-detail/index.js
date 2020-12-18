import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import iconBack from "../../assets/icon/icon-arrow-right.png";

import "./index.css";


const MovieDetail = function ({ movie, onClickActor, onBack }) {
  const [movieDetail, setMovieDetail] = useState({
    directors: [],
    writers: [],
  });

  useEffect(() => {
    const url = `http://localhost:3050/movies/${movie.id}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setMovieDetail(data);
      });
  }, [movie]);

  return (

    
    <div className="container">
      <img
        src={iconBack}
        width="48px"
        className="icon-back"
        alt=""
        onClick={() => onBack()}
      />


      <div className="content-wrap">

        <div className="poster">
          <img
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1608195040354&di=0a0a71578184325200e01344b6b59402&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201407%2F03%2F20140703200728_Lt2MK.jpeg"
            alt=""
          />
        </div>

        <div className="details">
          <h2 style={{ color: "#ffffff" }}>{movie.title}</h2>

          <div className="year-wrap">
            <span>year:</span>
            <span className="year">{movie.year}</span>
          </div>

          <div className="year-wrap">
            <span>rating:</span>
            <span className="year">{movie.rating}</span>
          </div>

          <div className="year-wrap">
            <span>runtime:</span>
            <span className="year">{movie.runtime}</span>
          </div>

          <div className="year-wrap">
            <span>votes:</span>
            <span className="year">{movie.votes}</span>
          </div>

          <div className="director-wrap">
            <span>directors:</span>

            {movieDetail.directors.map((value) => {
              return (
                <span
                  key={value.id}
                  className="director-item"
                  onClick={() => onClickActor(value.id)}
                >
                  {value.name}
                </span>
              );
            })}
          </div>

          <div className="writer-wrap">
            <span>writers:</span>

            {movieDetail.writers.map((value) => {
              return (
                <span
                  key={value.id}
                  className="writer-item"
                  onClick={() => onClickActor(value.id)}
                >
                  {value.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

MovieDetail.propTypes = {
  movie: PropTypes.object,
  onBack: PropTypes.func.isRequired,
  onClickActor: PropTypes.func.isRequired,
};

export default MovieDetail;
