import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./OverviewPopup.module.scss";
import { useEffect, useState } from "react";
import Search from "./components/Search/Search";

const cx = classNames.bind(styles);

function OverviewPopup({
  deselectAll,
  setDeselectAll,
  setIsOverviewPopup,
  currentStatues,
  handleChangeCurrentStatuses,
}) {
  const [checkedStatues, setCheckedStatuses] = useState(currentStatues);
  const [isClicked, setIsClicked] = useState(false);
  const [tagsResult, setTagsResult] = useState([]);

  const handleDeselectAll = () => {
    setDeselectAll(!deselectAll);
    setIsClicked(true);
  };

  const handleConfirmButton = () => {
    setIsOverviewPopup(false);
    handleChangeCurrentStatuses(checkedStatues);
  };

  const handleChangeCheckedStatus = (value) => {
    if (checkedStatues.includes(value)) {
      setCheckedStatuses((prevStatuses) => {
        return prevStatuses.filter((item) => item !== value);
      });
    } else {
      setCheckedStatuses((prevStatuses) => {
        return [...prevStatuses, value];
      });
    }
  };

  useEffect(() => {
    if (!isClicked) {
      return;
    } else {
      setIsClicked(false);
    }

    if (!deselectAll) {
      setCheckedStatuses([]);
      handleChangeCurrentStatuses([]);
    } else {
      /** In thhe future, maybe the user can create more custome tags, these lines will be replaced by an api calling! */
      setCheckedStatuses(() => tagsResult.map((item) => item.name));
      handleChangeCurrentStatuses(() => tagsResult.map((item) => item.name));
    }
  }, [deselectAll, isClicked, handleChangeCurrentStatuses, tagsResult]);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("header")}>
          <p className={cx("header_title")}>Tags</p>
          {deselectAll ? (
            <p className={cx("header_option")} onClick={handleDeselectAll}>
              Deselect all
            </p>
          ) : (
            <p className={cx("header_option")} onClick={handleDeselectAll}>
              Select all
            </p>
          )}
        </div>
        <div className={cx("body")}>
          <Search handleData={setTagsResult} />
          {tagsResult.map((item) => (
            <div className={cx("tag_item")} key={item._id}>
              <div
                className={cx("tag_item_dot")}
                style={{ "--tag-item-dot-color": `${item.color}` }}
              ></div>
              <p className={cx("tag_item_name")}>{item.name}</p>
              <input
                type="checkbox"
                className={cx("tag_item_checkbox")}
                checked={checkedStatues.includes(item.name)}
                onChange={() => handleChangeCheckedStatus(item.name)}
              />
            </div>
          ))}
        </div>
        <div className={cx("footer")}>
          <p className={cx("footer_info")}>
            {checkedStatues.length} tag(s) selected
          </p>
          <div className={cx("footer_button")}>
            <button
              className={cx("footer_button_cancel")}
              onClick={() => setIsOverviewPopup(false)}
            >
              Cancel
            </button>
            <button
              className={cx("footer_button_confirm")}
              onClick={handleConfirmButton}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

OverviewPopup.propTypes = {
  deselectAll: PropTypes.bool,
  setDeselectAll: PropTypes.func,
  setIsOverviewPopup: PropTypes.func,
  currentStatues: PropTypes.array,
  handleChangeCurrentStatuses: PropTypes.func,
};

export default OverviewPopup;
