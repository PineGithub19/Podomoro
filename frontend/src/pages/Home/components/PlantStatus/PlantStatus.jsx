import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./PlantStatus.module.scss";

const cx = classNames.bind(styles);
const STATUS = ["Study", "Rest", "Entertainment", "Other"];

function PlantStatus() {
  const [activeStatus, setActiveStatus] = useState(0);
  const [isShowPopup, setIsShowPopup] = useState(false);

  const handleShowPopup = () => {
    setIsShowPopup(!isShowPopup);
  };

  const handleChangeStatus = (index) => {
    setActiveStatus(index);
    setIsShowPopup(false);
  };

  return (
    <div className={cx("plant_status")}>
      <div
        className={cx("status_dot", {
          study: activeStatus === 0,
          rest: activeStatus === 1,
          entertainment: activeStatus === 2,
          other: activeStatus === 3,
        })}
      ></div>
      <div className={cx("status_text")} onClick={handleShowPopup}>
        {STATUS[activeStatus]}
      </div>
      {isShowPopup && (
        <div className={cx("popup_status")}>
          <p className={cx("popup_status_header")}>Tags</p>
          {STATUS.map((status, index) => (
            <div
              className={cx("popup_item", {
                active: activeStatus === index,
              })}
              key={index}
              onClick={() => handleChangeStatus(index)}
            >
              <div
                className={cx("status_dot", {
                  study: index === 0,
                  rest: index === 1,
                  entertainment: index === 2,
                  other: index === 3,
                })}
              ></div>
              <div className={cx("popup_item_text")}>{status}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlantStatus;
