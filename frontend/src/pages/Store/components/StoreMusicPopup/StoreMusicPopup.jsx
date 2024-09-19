import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./StoreMusicPopup.module.scss";
import Cookies from "universal-cookie";
import { request } from "../../../../api/request";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faPause,
  faPlay,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import YouTube from "react-youtube";

const cx = classNames.bind(styles);

function StoreMusicPopup({
  handleActivePopup,
  isUnlocked,
  coins,
  handleCoins,
  data,
}) {
  const playerRef = useRef(null);
  const videoId = data.link.split("v=")[1];

  const [isMusicActive, setIsMusicActive] = useState(true);

  const [showMessage, setShowMessage] = useState(false);
  const [validMessage, setValidMessage] = useState(false);
  const [message, setMessage] = useState("");

  const handleBuyMusic = async () => {
    if (coins < data.coin) {
      setValidMessage(false);
      setMessage("not enough money");
      setShowMessage(true);
      return;
    }

    const cookies = new Cookies();
    const token = cookies.get("token");
    try {
      const response = await request.post(
        "/music/my-music",
        {
          musicId: data._id,
          buy: true,
          current: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        const totalCoins = coins - data.coin;
        const coinsResponse = await request.put("coin/my-coin", {
          token: token,
          coin: totalCoins,
        });

        if (coinsResponse.status === 200) {
          handleCoins(totalCoins);
          handleActivePopup(false);
          setValidMessage(true);
          setMessage("buy successfully");
          setShowMessage(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  /** Music Setting */
  const handleActiveMusic = () => {
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

  /** Message */

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
  }, [showMessage]);

  return (
    <div className={cx("wrapper")} onClick={() => handleActivePopup(false)}>
      <div className={cx("container")} onClick={(e) => e.stopPropagation()}>
        <div className={cx("avatar_container")}>
          <img className={cx("avatar")} src={data.image} alt={data.name} />
          {isMusicActive ? (
            <FontAwesomeIcon
              icon={faPause}
              className={cx("pause_icon")}
              onClick={handleActiveMusic}
            />
          ) : (
            <FontAwesomeIcon
              icon={faPlay}
              className={cx("play_icon")}
              onClick={handleActiveMusic}
            />
          )}
        </div>
        <p className={cx("title")}>{data.name}</p>
        <p className={cx("description")}>{data.description}</p>
        {isUnlocked ? (
          <p className={cx("unlocked")}>Unlocked</p>
        ) : (
          <div className={cx("price")} onClick={handleBuyMusic}>
            <p className={cx("price_text")}>{data.coin}</p>
            <FontAwesomeIcon className={cx("price_coin_icon")} icon={faCoins} />
          </div>
        )}
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
        {showMessage && (
          <div className={cx("message")}>
            <p
              className={cx("message_text", {
                success: validMessage,
                error: !validMessage,
              })}
            >
              {message}
            </p>
            <FontAwesomeIcon
              icon={faXmark}
              className={cx("message_close_icon")}
              onClick={handleCloseMessage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

StoreMusicPopup.propTypes = {
  handleActivePopup: PropTypes.func,
  isUnlocked: PropTypes.object,
  coins: PropTypes.number,
  handleCoins: PropTypes.func,
  data: PropTypes.object,
};

export default StoreMusicPopup;
