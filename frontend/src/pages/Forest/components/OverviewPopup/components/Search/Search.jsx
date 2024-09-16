import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./Search.module.scss";
import { request } from "../../../../../../api/request";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useDebounce } from "../../../../../../hooks/useDebounce";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const cx = classNames.bind(styles);

function Search({ handleData }) {
  /** By default, if the search bar is empty, it will return all tags on the screen */
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);

  const handleSearchValue = (value) => {
    setSearchValue(value);
  };

  useEffect(() => {
    const fetchTags = async () => {
      const cookies = new Cookies();
      const token = cookies.get("token");

      try {
        const response = await request.get("/tag/get-tags-by-name", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            tagName: debouncedSearch,
          },
        });

        if (response.status === 200) {
          handleData(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <div className={cx("search_bar")}>
      <input
        type="text"
        placeholder="Search tags"
        className={cx("search_input")}
        value={searchValue}
        onChange={(e) => handleSearchValue(e.target.value)}
      />
      <FontAwesomeIcon icon={faMagnifyingGlass} className={cx("search_icon")} />
    </div>
  );
}

Search.propTypes = {
  handleData: PropTypes.func,
};

export default Search;
