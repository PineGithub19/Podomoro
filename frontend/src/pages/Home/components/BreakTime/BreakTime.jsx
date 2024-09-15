import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./BreakTime.module.scss";
import { useEffect, useState } from "react";

const cx = classNames.bind(styles);
const BREAK_MINUTES = 0;
const BREAK_SECONDS = 5;

function addLeadingZero(value) {
  return value.toString().padStart(2, "0");
}

function BreakTime({ handleBreakTime }) {
  const [startCountdown, setStartCountdown] = useState(false);
  const [breakMinuteLeft, setBreakMinuteLeft] = useState(BREAK_MINUTES);
  const [breakSecondLeft, setBreakSecondLeft] = useState(BREAK_SECONDS);

  useEffect(() => {
    if (!startCountdown) {
      console.log(breakMinuteLeft, breakSecondLeft);
      return;
    }

    if (breakMinuteLeft === 0 && breakSecondLeft === 0) {
      setStartCountdown(false);
      handleBreakTime(false);
    }

    const timerId = setInterval(() => {
      let time = breakMinuteLeft * 60 + breakSecondLeft;
      time -= 1;
      setBreakMinuteLeft(Math.floor(time / 60));
      setBreakSecondLeft(time % 60);
    }, 1000);

    return () => clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakMinuteLeft, breakSecondLeft, startCountdown]);

  return (
    <div className={cx("wrapper")}>
      <p className={cx("break_title")}>Let&apos;s take a short break</p>
      <div className={cx("time")}>
        <p className={cx("time_minutes")}>{addLeadingZero(breakMinuteLeft)}</p>
        <p className={cx("time_dot")}>:</p>
        <p className={cx("time_seconds")}>{addLeadingZero(breakSecondLeft)}</p>
      </div>
      <div className={cx("button_container")}>
        {!startCountdown && (
          <button
            className={cx("start_button")}
            onClick={() => setStartCountdown(true)}
          >
            Start
          </button>
        )}
        <button
          className={cx("skip_button")}
          onClick={() => handleBreakTime(false)}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

BreakTime.propTypes = {
  handleBreakTime: PropTypes.func,
};

export default BreakTime;
