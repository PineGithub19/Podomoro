import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ChangeMusic.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import { request } from "../../../../../api/request";
import Cookies from "universal-cookie";

const cx = classNames.bind(styles);

function ChangeMusic({
  handleChangeMusic,
  handleActiveChangeMusic,
  handleActiveMusicIcon,
}) {
  const [myMusics, setMyMusics] = useState([]);
  const [myMusicVisualization, setMyMusicsVisualization] = useState([]);
  const [activeMusic, setActiveMusic] = useState(0);
  const [previousMusic, setPreviousMusic] = useState(0);

  useEffect(() => {
    const fetchMyMusics = async () => {
      const cookies = new Cookies();
      const token = cookies.get("token");

      try {
        const response = await request.get("/music/my-music", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const ids = response.data;

          const musicsResponse = await Promise.all(
            ids.map((item) =>
              request.get(`music/current-music/${item.musicId}`)
            )
          );
          setMyMusics(musicsResponse.map((item) => item.data));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchMyMusics();
  }, []);

  useEffect(() => {
    const fetchActiveMusic = async () => {
      const cookies = new Cookies();
      const token = cookies.get("token");

      try {
        const response = await request.get("/music/my-current-music", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const index = myMusics.findIndex(
            (item) => item._id === response.data.musicId
          );
          setActiveMusic(response.data.musicId);
          setMyMusicsVisualization(myMusics.slice(index));
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (myMusics) {
      fetchActiveMusic();
    }
  }, [myMusics]);

  const handleChooseMusic = (type) => {
    if (type === "next") {
      const index = myMusics.findIndex((item) => item._id === activeMusic);
      setPreviousMusic(myMusics[index]._id);

      if (index + 1 < myMusics.length) {
        setActiveMusic(myMusics[index + 1]._id);
        setMyMusicsVisualization(myMusics.slice(index + 1));
      }
    } else if (type === "previous") {
      const index = myMusics.findIndex((item) => item._id === activeMusic);
      setPreviousMusic(myMusics[index]._id);

      if (index - 1 >= 0) {
        setActiveMusic(myMusics[index - 1]._id);
        setMyMusicsVisualization(myMusics.slice(index - 1));
      }
    }
  };

  useEffect(() => {
    if (myMusicVisualization.length === 0) {
      return;
    }

    const handleUpdateCurrentMusic = async () => {
      try {
        await request.put(`music/my-music/${previousMusic}`, {
          current: false,
        });
        await request.put(`music/my-music/${activeMusic}`, {
          current: true,
        });
      } catch (error) {
        console.log(error);
      }
    };

    handleChangeMusic(myMusicVisualization[0].link.split("v=")[1]);
    handleActiveMusicIcon(true);
    handleUpdateCurrentMusic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myMusicVisualization]);

  return (
    <div
      className={cx("change_music_wrapper")}
      onClick={() => handleActiveChangeMusic(false)}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div
        className={cx("change_music_container")}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={cx("change_music_list")}>
          {myMusicVisualization.length !== 0 &&
            myMusicVisualization.map((item) => (
              <div className={cx("music_item")} key={item._id}>
                <p className={cx("music_title")}>{item.name}</p>
              </div>
            ))}
        </div>
        <div className={cx("options")}>
          <FontAwesomeIcon
            icon={faChevronUp}
            className={cx("previous_icon")}
            onClick={() => handleChooseMusic("previous")}
          />
          <FontAwesomeIcon
            icon={faChevronDown}
            className={cx("next_icon")}
            onClick={() => handleChooseMusic("next")}
          />
        </div>
        <p className={cx("change_music_note")}>
          * More sounds to be unlocked on the Store page.
        </p>
      </div>
    </div>
  );
}

ChangeMusic.propTypes = {
  handleActiveMusicIcon: PropTypes.func,
  handleChangeMusic: PropTypes.func,
  handleActiveChangeMusic: PropTypes.func,
};

export default ChangeMusic;
