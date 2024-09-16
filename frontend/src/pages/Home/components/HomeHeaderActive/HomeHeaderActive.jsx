import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";

import classNames from "classnames/bind";
import styles from "./HomeHeaderActive.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphones } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function HomeHeaderActive({ videoId }) {
  const [isMusicActive, setIsMusicActive] = useState(true); // music icon
  const playerRef = useRef(null);

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

  return (
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

        <div className={cx("video_frame")}>
          <YouTube
            videoId={videoId} // Use the video ID here
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
  );
}

HomeHeaderActive.propTypes = {
  videoId: PropTypes.string,
};

export default HomeHeaderActive;
