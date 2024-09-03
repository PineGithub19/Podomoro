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

const cx = classNames.bind(styles);

function HomeHeader({ isRunning }) {
  const [isMusicActive, setIsMusicActive] = useState(true);

  const handleIsMusicActive = () => {
    setIsMusicActive(!isMusicActive);
  };

  return (
    <>
      {!isRunning ? (
        <div className={cx("header")}>
          <div className={cx("header_container")}>
            <FontAwesomeIcon className={cx("header_menu_icon")} icon={faBars} />
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
    </>
  );
}

HomeHeader.propTypes = {
  isRunning: PropTypes.bool,
};

export default HomeHeader;
