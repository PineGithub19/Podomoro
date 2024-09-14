import PropTypes from "prop-types";
import { useEffect, useState } from "react";
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
import { request } from "../../../../api/request";
import Cookies from "universal-cookie";

const cx = classNames.bind(styles);

function HomeHeader({ isRunning }) {
  const [isMusicActive, setIsMusicActive] = useState(true);
  const [isSideBarActive, setIsSideBarActive] = useState(false);
  const [coins, setMyCoins] = useState(Number(0));

  const handleIsMusicActive = () => {
    setIsMusicActive(!isMusicActive);
  };

  const handleIsSideBarActive = () => {
    setIsSideBarActive(!isSideBarActive);
  };

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");

    const fetchGetMyCoins = async () => {
      try {
        const response = await request.get("coin/my-coin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setMyCoins(response.data[0].coin);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSetMyCoins = async () => {
      await request.post("coin/my-coin", {
        token: token,
        coin: 0,
      });
    };

    fetchGetMyCoins();
    fetchSetMyCoins();
  }, []);

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
              <span className={cx("coin_count")}>{coins}</span>
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
