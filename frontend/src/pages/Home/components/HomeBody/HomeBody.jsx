import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./HomeBody.module.scss";
import PlantStatus from "../PlantStatus/PlantStatus";

const cx = classNames.bind(styles);

function addLeadingZero(value) {
  return value.toString().padStart(2, "0");
}

function HomeBody({ isRunning, setIsRunning }) {
  const [value, setValue] = useState(100);
  const [minuteLeft, setMinuteLeft] = useState(1);
  const [secondLeft, setSecondLeft] = useState(0);
  const [isCanceled, setIsCanceled] = useState(false);

  const handleIsCanceled = () => {
    setIsCanceled(!isCanceled);
  };

  useEffect(() => {
    if (minuteLeft === 0 && secondLeft === 0) {
      setIsRunning(false);
    }

    if (!isRunning) {
      setMinuteLeft(1);
      setSecondLeft(0);
      setValue(100);
      return;
    }

    const timerId = setInterval(() => {
      let time = minuteLeft * 60 + secondLeft;
      time -= 1;
      setMinuteLeft(Math.floor(time / 60));
      setSecondLeft(time % 60);
      setValue((time / (1 * 60)) * 100);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning, minuteLeft, secondLeft, setIsRunning]);

  return (
    <>
      <div className={cx("wrapper")}>
        <div className={cx("header")}>
          <p className={cx("welcome_paragraph")}>Start planting today!</p>
        </div>
        <div className={cx("body")}>
          <div className={cx("timer")}>
            <div className={cx("circle")} style={{ "--timer-value": value }}>
              <div className={cx("time")}>
                <p className={cx("minute")}>{addLeadingZero(minuteLeft)}</p>
                <p className={cx("dot")}>:</p>
                <p className={cx("second")}>{addLeadingZero(secondLeft)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className={cx("footer")}>
          <PlantStatus />
          {!isRunning ? (
            <button
              className={cx("plant_btn")}
              onClick={() => setIsRunning(!isRunning)}
            >
              Plant
            </button>
          ) : (
            <button
              className={cx("plant_btn_cancel")}
              onClick={handleIsCanceled}
            >
              Give up
            </button>
          )}
        </div>
      </div>
      {isRunning && isCanceled && (
        <div className={cx("popup_canceled")}>
          <div className={cx("popup_canceled_container")}>
            <p className={cx("popup_canceled_text")}>
              Are you sure you want to give up?
            </p>
            <div className={cx("popup_canceled_btn_container")}>
              <button
                className={cx("popup_canceled_btn")}
                onClick={() => {
                  setIsRunning(false);
                  setIsCanceled(false);
                }}
              >
                Give up
              </button>
              <button
                className={cx("popup_continue_btn")}
                onClick={() => setIsCanceled(false)}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

HomeBody.propTypes = {
  isRunning: PropTypes.bool.isRequired,
  setIsRunning: PropTypes.func.isRequired,
};

export default HomeBody;
