import PropTypes from "prop-types";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHeadphones,
  faHourglassStart,
} from "@fortawesome/free-solid-svg-icons";
import { faFire, faCoins } from "@fortawesome/free-solid-svg-icons";

import classNames from "classnames/bind";
import styles from "./HomeHeader.module.scss";
import SideBar from "../../../../components/SideBar";

const cx = classNames.bind(styles);

function HomeHeader({ isRunning }) {
  const [isMusicActive, setIsMusicActive] = useState(true);
  const [isSideBarActive, setIsSideBarActive] = useState(false);

  const handleIsMusicActive = () => {
    setIsMusicActive(!isMusicActive);
  };

  const handleIsSideBarActive = () => {
    setIsSideBarActive(!isSideBarActive);
  };

  return (
    <>
      {!isRunning ? (
        <div className={cx("header")}>
          <div className={cx("header_container")}>
            <FontAwesomeIcon
              className={cx("header_menu_icon")}
              icon={faBars}
              onClick={handleIsSideBarActive}
            />
            <div className={cx("header_options")}>
              <FontAwesomeIcon
                className={cx("hourglass_icon")}
                icon={faHourglassStart}
              />
              <FontAwesomeIcon className={cx("fire_icon")} icon={faFire} />
            </div>
            <div className={cx("coins")}>
              <FontAwesomeIcon
                className={cx("header_coin_icon")}
                icon={faCoins}
              />
              <span className={cx("coin_count")}>0</span>
            </div>
          </div>
        </div>
      ) : (
        <div className={cx("header_active")}>
          <div
            className={cx("music_icon_container", {
              musicInActive: isMusicActive === false,
            })}
          >
            <FontAwesomeIcon
              icon={faHeadphones}
              className={cx("music_icon")}
              onClick={handleIsMusicActive}
            />
          </div>
        </div>
      )}
      {isSideBarActive && (
        <SideBar
          isSideBarActive={isSideBarActive}
          setIsSideBarActive={setIsSideBarActive}
        />
      )}
    </>
  );
}

HomeHeader.propTypes = {
  isRunning: PropTypes.bool,
};

export default HomeHeader;
