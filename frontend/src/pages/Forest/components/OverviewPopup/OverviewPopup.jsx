import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./OverviewPopup.module.scss";
import { useEffect, useState } from "react";
import Search from "./components/Search/Search";

const cx = classNames.bind(styles);

const PLANT_STATUS = ["Study", "Rest", "Entertainment", "Other"];

function OverviewPopup({
  setIsOverviewPopup,
  currentStatues,
  handleChangeCurrentStatuses,
}) {
  const [deselectAll, setDeselectAll] = useState(true);
  const [checkedStatues, setCheckedStatuses] = useState(() => {
    const result = PLANT_STATUS.map((status) => {
      if (currentStatues.find((item) => item === status)) {
        return status;
      }
    });
    return result.filter((item) => item !== undefined);
  });
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
      setCheckedStatuses(() => PLANT_STATUS.map((item) => item));
      handleChangeCurrentStatuses(() => PLANT_STATUS.map((item) => item));
    }
  }, [deselectAll, isClicked, handleChangeCurrentStatuses]);

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
          {tagsResult.length === 0
            ? PLANT_STATUS.map((item, index) => (
                <div className={cx("tag_item")} key={index}>
                  <div
                    className={cx("tag_item_dot", {
                      study: index === 0,
                      rest: index === 1,
                      entertainment: index === 2,
                      other: index === 3,
                    })}
                  ></div>
                  <p className={cx("tag_item_name")}>{item}</p>
                  <input
                    type="checkbox"
                    className={cx("tag_item_checkbox")}
                    checked={checkedStatues.includes(item)}
                    onChange={() => handleChangeCheckedStatus(item)}
                  />
                </div>
              ))
            : tagsResult.map((item, index) => (
                <div className={cx("tag_item")} key={index}>
                  <div
                    className={cx("tag_item_dot", {
                      study: item.name === "Study",
                      rest: item.name === "Rest",
                      entertainment: item.name === "Entertainment",
                      other: item.name === "Other",
                    })}
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
  setIsOverviewPopup: PropTypes.func,
  currentStatues: PropTypes.array,
  handleChangeCurrentStatuses: PropTypes.func,
};

export default OverviewPopup;
