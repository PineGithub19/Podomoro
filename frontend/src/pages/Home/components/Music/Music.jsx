import PropTypes from "prop-types";
import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Music.module.scss";

const cx = classNames.bind(styles);

function Music({ handleVideoId, handleActiveMusic, handleDoneInputMusicLink }) {
  const [activeMusicLink, setActiveMusicLink] = useState("");

  const handleDoneButton = () => {
    handleActiveMusic(false);
    handleDoneInputMusicLink(true);
    handleVideoId(activeMusicLink.split("v=")[1]);
  };

  return (
    <div className={cx("wrapper")}>
      <input
        className={cx("input_music_link")}
        type="text"
        placeholder="Music link here..."
        value={activeMusicLink}
        onChange={(e) => setActiveMusicLink(e.target.value)}
      />
      <div className={cx("done_button")} onClick={handleDoneButton}>
        Done
      </div>
    </div>
  );
}

Music.propTypes = {
  handleVideoId: PropTypes.func,
  handleActiveMusic: PropTypes.func,
  handleDoneInputMusicLink: PropTypes.func,
};

export default Music;
