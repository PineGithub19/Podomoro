import { useEffect, useState } from "react";
import classnames from "classnames/bind";
import styles from "./Tag.module.scss";
import { request } from "../../api/request";
import Cookies from "universal-cookie";

import SideBar from "../../components/SideBar";
import SearchTags from "./component/SearchTags";
import CreateTag from "./component/CreateTag/CreateTag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const cx = classnames.bind(styles);

function Tag() {
  const [isSideBarActive, setIsSideBarActive] = useState(false);
  const [myTags, setMyTags] = useState([]);
  const [commonTags, setCommonTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagData, setTagdata] = useState([]);

  const [searchResult, setSearchResult] = useState("");
  const [isCreateTag, setIsCreateTag] = useState(false);

  const handleIsActiveSideBar = () => {
    setIsSideBarActive(!isSideBarActive);
  };

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    const fetchCommonTags = async () => {
      try {
        const response = await request.get("tag/get-common-tags", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setCommonTags(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPersonalTags = async () => {
      try {
        const response = await request.get("tag/get-tags", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setMyTags(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCommonTags();
    fetchPersonalTags();
  }, []);

  useEffect(() => {
    if (myTags.length !== 0 || commonTags.length !== 0) {
      setTags(commonTags.concat(myTags));
    }
  }, [myTags, commonTags]);

  return (
    <>
      <div className={cx("wrapper")}>
        <div className={cx("header")}>
          <div className={cx("header_container")}>
            <FontAwesomeIcon
              icon={faBars}
              className={cx("header_menu_icon")}
              onClick={handleIsActiveSideBar}
            />
            <p className={cx("header_title")}>Tags</p>
            {isSideBarActive && (
              <SideBar
                isSideBarActive={isSideBarActive}
                setIsSideBarActive={setIsSideBarActive}
              />
            )}
          </div>
        </div>
        <div className={cx("body")}>
          <div className={cx("body_container")}>
            <SearchTags
              handleSearchResult={setSearchResult}
              handleData={setTagdata}
            />
            <div className={cx("tags_list")}>
              {searchResult && (
                <div
                  className={cx("create_tag")}
                  onClick={() => setIsCreateTag(true)}
                >
                  <p className={cx("create_tag_title")}>
                    Create Tag: {searchResult}
                  </p>
                </div>
              )}
              {tagData.length === 0
                ? tags.map((tag) => (
                    <div className={cx("tag_item")} key={tag._id}>
                      <div
                        className={cx("tag_item_dot")}
                        style={{ "--dot-color": `${tag.color}` }}
                      ></div>
                      <p className={cx("tag_item_title")}>{tag.name}</p>
                    </div>
                  ))
                : tagData.map((tag) => (
                    <div className={cx("tag_item")} key={tag._id}>
                      <div
                        className={cx("tag_item_dot")}
                        style={{ "--dot-color": `${tag.color}` }}
                      ></div>
                      <p className={cx("tag_item_title")}>{tag.name}</p>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
      {isCreateTag && (
        <CreateTag
          tagname={searchResult}
          handleDisplayCreateTag={setIsCreateTag}
        />
      )}
    </>
  );
}

export default Tag;
