import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./OverviewPopup.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const cx = classNames.bind(styles);

const PLANT_STATUS = ["Study", "Rest", "Entertainment", "Other"];

function OverviewPopup({ setIsOverviewPopup }) {
  const [deselectAll, setDeselectAll] = useState(true);

  const handleDeselectAll = () => {
    setDeselectAll(!deselectAll);
  };

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
          <div className={cx("search_bar")}>
            <input
              type="text"
              placeholder="Search tags"
              className={cx("search_input")}
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className={cx("search_icon")}
            />
          </div>
          {PLANT_STATUS.map((item, index) => (
            <>
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
                <input type="checkbox" className={cx("tag_item_checkbox")} />
              </div>
            </>
          ))}
        </div>
        <div className={cx("footer")}>
          <p className={cx("footer_info")}>4 tag(s) selected</p>
          <div className={cx("footer_button")}>
            <button
              className={cx("footer_button_cancel")}
              onClick={() => setIsOverviewPopup(false)}
            >
              Cancel
            </button>
            <button className={cx("footer_button_confirm")}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
}

OverviewPopup.propTypes = {
  setIsOverviewPopup: PropTypes.func,
};

export default OverviewPopup;
