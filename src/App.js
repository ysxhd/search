import React, { useState, useRef, useEffect } from "react";
import { Pagination, Layout, Menu, Dropdown, Divider } from "antd";

import Search from "./components/search-box";
import Movies from "./components/movies";
import MovieDetail from "./components/movie-detail";

import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  DownOutlined
} from '@ant-design/icons';

import "./App.css";
import { render } from "@testing-library/react";

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const App = function () {
  const [type, setType] = useState(1); // 1-电影列表；2-电影详情；3-演员详情
  const [movies, setMovies] = useState([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  const clickIndex = useRef(-1);
  const query = useRef("");

  function handleSearch(value) {
    query.current = value;
    searchMovie(value);
  }

  function handleClickMovie(index) {
    setType(2);
    clickIndex.current = index;
  }

  function handleClickActor(actor) {
    const url = `http://localhost:3050/crew/${actor}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setType(1);
        setMovies(data.movies);

        setTotal(-1);
      });
  }

  function handleMovieDetailBack() {
    setType(1);
  }

  function getPopularMovies() {
    const url = `http://localhost:3050/movies?query=${query.current}&offset=${offset}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.items);

        setTotal(data.total);
      });
  }

  function searchMovie(query) {
    setOffset(0);

    const url = `http://localhost:3050/movies?query=${query}&offset=0`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.items);
        setTotal(data.total);
      });
  }

  function handlePageChange(current) {
    setOffset(current - 1);

    const url = `http://localhost:3050/movies?query=${query.current}&offset=${
      current - 1
    }`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.items);

        setTotal(data.total);
      });
  }

  useEffect(() => {
    getPopularMovies();
  }, []);

  const menu = (
    <Menu>
      <Menu.Item>test</Menu.Item>
    </Menu>
  );
 
  return (

      <div className="window-margin">
	          <div className="window">

            <aside className="sidebar">
			   <div className="top-bar">
				<p className="logo">IMDB</p>
			</div>

			<div className="search-box">
      <Search onSearch={(value) => handleSearch(value)} />
			</div>
			<menu className="menu">
				<p className="menu-name">Movie trailers</p>
				<ul className="no-bullets">
					<li className="active">
						<a href="#">Action / Adventure</a>
						<ul>
							<li><a href="#">Latest</a></li>
							<li className="active"><a href="#">Popular</a></li>
							<li><a href="#">Coming soon</a></li>
							<li><a href="#">Staff picks</a></li>
						</ul>
					</li>
					<li><a href="#">Drama </a></li>
					<li><a href="#">Comedy</a></li>
					<li><a href="#">Documentaries</a></li>
					<li><a href="#">Drama</a></li>
					<li><a href="#">Horror</a></li>
					<li><a href="#">Sci-Fi  / Fantasy</a></li>
					<li><a href="#">List A-Z</a></li>
				</ul>

				<div className="separator"></div>

				<ul className="no-bullets">
					<li><a href="#">Latest news</a></li>
					<li><a href="#">Critic reviews</a></li>
					<li><a href="#">Box office</a></li>
					<li><a href="#">Top 250</a></li>
				</ul>

				<div className="separator"></div>
			</menu>
		</aside>


		<div className="main" role="main">

			<div className="top-bar">

				<ul class="top-menu no-bullets" >
					<li class="menu-icon trigger-sidebar-toggle">
						{/* <div class="line"></div>
						<div class="line"></div>
						<div class="line"></div> */}
					</li>
					<li><a href="#">Headlines</a></li>
					<li><a href="#">Articles</a></li>
					<li class="active"><a href="#">Movies & Films</a></li>
					<li><a href="#">Television</a></li>
					<li><a href="#">Music</a></li>
          <li><a href="#">Celebrities</a></li>
				</ul>

			</div>


      <Content>

<div className="content">
  <div style={{ display: `${type === 1 ? "block" : "none"}` }}>
    <Movies
      movies={movies}
      onClickItem={(index) => handleClickMovie(index)}
    />
  </div>

  <div style={{ display: `${type === 2 ? "block" : "none"}` }}>
    {movies && movies.length && clickIndex.current !== -1 && (
      <MovieDetail
        movie={movies[clickIndex.current]}
        onBack={() => handleMovieDetailBack()}
        onClickActor={(value) => handleClickActor(value)}
      />
    )}
  </div>

  {total !== -1 && (
    <div className="pagination-wrap">
      <Pagination
        current={offset + 1}
        total={total}
        showSizeChanger={false}
        onChange={(current) => handlePageChange(current)}
      />
    </div>
  )}
</div>
</Content>

     </div>
      </div>
      </div>
   

  );
};

export default App;
