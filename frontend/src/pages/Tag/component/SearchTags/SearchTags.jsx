import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./SearchTags.module.scss";
import { useDebounce } from "../../../../hooks/useDebounce";
import Cookies from "universal-cookie";
import { request } from "../../../../api/request";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function SearchTags({ handleSearchResult, handleData }) {
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
    handleSearchResult(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <div className={cx("input_container")}>
      <input
        className={cx("search_tags_bar")}
        type="text"
        placeholder="Search or create tags"
        value={searchValue}
        onChange={(e) => handleSearchValue(e.target.value)}
      />
      <FontAwesomeIcon className={cx("search_icon")} icon={faMagnifyingGlass} />
    </div>
  );
}

SearchTags.propTypes = {
  handleData: PropTypes.func,
  handleSearchResult: PropTypes.func,
};

export default SearchTags;
