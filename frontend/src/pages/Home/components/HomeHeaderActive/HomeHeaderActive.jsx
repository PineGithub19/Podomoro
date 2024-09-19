import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import Cookies from "universal-cookie";

import classNames from "classnames/bind";
import styles from "./HomeHeaderActive.module.scss";
import Note from "../Note/Note";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphones, faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import { request } from "../../../../api/request";
import ChangeMusic from "./ChangeMusic";

const cx = classNames.bind(styles);

function HomeHeaderActive({ videoId }) {
  const [isMusicActive, setIsMusicActive] = useState(true); // music icon
  const [currentMusic, setCurrentMusic] = useState(videoId); // contains videoId
  const playerRef = useRef(null);

  const [activeChangeMusic, setActiveChangeMusic] = useState(false);

  const handleIsMusicActive = () => {
    setIsMusicActive(!isMusicActive);
  };

  const onReady = (event) => {
    playerRef.current = event.target; // Store the player instance
  };

  const onEnd = () => {
    if (playerRef.current) {
      playerRef.current.playVideo(); // Replay the video when it ends
    }
  };

  useEffect(() => {
    if (isMusicActive && playerRef.current) {
      playerRef.current.playVideo();
    } else if (!isMusicActive && playerRef.current) {
      playerRef.current.pauseVideo();
    }
  }, [isMusicActive]);

  useEffect(() => {
    const fetchMusic = async () => {
      const cookies = new Cookies();
      const token = cookies.get("token");

      try {
        const response = await request.get("/music/my-current-music", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const musicId = response.data.musicId;

          const musicLinkResponse = await request.get(
            `/music/current-music/${musicId}`
          );

          if (musicLinkResponse.status === 200) {
            setCurrentMusic(musicLinkResponse.data.link.split("v=")[1]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (!currentMusic) {
      fetchMusic();
    }
  }, [currentMusic]);

  const handleChangeMusic = (event) => {
    if (event.button !== 2) {
      return;
    }
    event.preventDefault();
    setActiveChangeMusic(true);
  };

  /** NOTES */
  const [activeNote, setActiveNote] = useState(false);

  const handleActiveNote = () => {
    setActiveNote(!activeNote);
  };

  return (
    <>
      <div className={cx("header_active")}>
        <div
          className={cx("music_icon_container", {
            musicInActive: isMusicActive === false,
          })}
        >
          <FontAwesomeIcon
            icon={faNoteSticky}
            className={cx("note_icon")}
            onClick={handleActiveNote}
          />
          <FontAwesomeIcon
            icon={faHeadphones}
            className={cx("music_icon")}
            onClick={handleIsMusicActive}
            onMouseDown={handleChangeMusic}
            onContextMenu={(event) => event.preventDefault()}
          />

          <div className={cx("video_frame")}>
            <YouTube
              key={currentMusic}
              videoId={currentMusic} // Use the video ID here
              opts={{
                playerVars: {
                  autoplay: 1,
                  controls: 0,
                  modestbranding: 1,
                  showinfo: 0,
                },
              }}
              onReady={onReady}
              onEnd={onEnd} // Optional: handle end of video
            />
          </div>
        </div>
      </div>
      {activeNote && <Note handleActiveNote={setActiveNote} />}
      {activeChangeMusic && (
        <ChangeMusic
          handleActiveMusicIcon={setIsMusicActive}
          handleChangeMusic={setCurrentMusic}
          handleActiveChangeMusic={setActiveChangeMusic}
        />
      )}
    </>
  );
}

HomeHeaderActive.propTypes = {
  videoId: PropTypes.string,
};

export default HomeHeaderActive;
