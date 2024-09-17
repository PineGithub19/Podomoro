import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faMusic,
  faStickyNote,
} from "@fortawesome/free-solid-svg-icons";
import { faCoins } from "@fortawesome/free-solid-svg-icons";

import classNames from "classnames/bind";
import styles from "./HomeHeader.module.scss";

import SideBar from "../../../../components/SideBar";
import Note from "../Note/Note";
import Music from "../Music/Music";
import HomeHeaderActive from "../HomeHeaderActive/HomeHeaderActive";

import { request } from "../../../../api/request";
import Cookies from "universal-cookie";

const cx = classNames.bind(styles);

function HomeHeader({ isRunning }) {
  const [isSideBarActive, setIsSideBarActive] = useState(false);
  const [coins, setMyCoins] = useState(Number(0));

  /** Note */
  const [activeNote, setActiveNote] = useState(false);

  /** Music */
  const [activeMusic, setActiveMusic] = useState(false); // toggle the input audio box
  const [, setDoneInputMusicLink] = useState(false);
  const [videoId, setVideoId] = useState("");

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

  /** Music control */

  const handleActiveMusic = () => {
    setActiveMusic(!activeMusic);
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
                className={cx("choose_music_icon")}
                icon={faMusic}
                onClick={handleActiveMusic}
              />
              <FontAwesomeIcon
                className={cx("note_icon")}
                icon={faStickyNote}
                onClick={() => setActiveNote(!activeNote)}
              />

              {activeMusic && (
                <Music
                  handleVideoId={setVideoId}
                  handleActiveMusic={setActiveMusic}
                  handleDoneInputMusicLink={setDoneInputMusicLink}
                />
              )}
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
        <HomeHeaderActive videoId={videoId} />
      )}
      {isSideBarActive && (
        <SideBar
          isSideBarActive={isSideBarActive}
          setIsSideBarActive={setIsSideBarActive}
        />
      )}
      {activeNote && <Note handleActiveNote={setActiveNote} />}
    </>
  );
}

HomeHeader.propTypes = {
  isRunning: PropTypes.bool,
};

export default HomeHeader;
