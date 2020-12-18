import React, { useState } from "react";
import PropTypes from "prop-types";
import "./index.css";

import { SearchOutlined } from "@ant-design/icons";

const SearchBox = ({ onSearch }) => {
  const [search, setSearch] = useState("");

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  function handleEnterKey(e) {
    if (e.keyCode === 13) {
      onSearch(e.target.value);
    }
  }

  return (
    <div className="search">
      <input
        type="search"
        value={search}
        onChange={(e) => handleSearch(e)}
        onKeyUp={(e) => handleEnterKey(e)}
        placeholder="Search"
      />

      <SearchOutlined className="icon" />
    </div>
  );
};

SearchBox.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBox;
