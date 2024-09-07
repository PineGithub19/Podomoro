import PropTypes from "prop-types";
import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./TimeController.module.scss";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const cx = classNames.bind(styles);
const currentDate = new Date();

export function TimeController({ onChangeDate, onChangeMonth, onChangeYear }) {
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(
    (currentDate.getMonth() + 1).toString().padStart(2, "0")
  );
  const [currentDay, setCurrentDay] = useState(
    currentDate.getDate().toString().padStart(2, "0")
  );

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate(); // 0 day of next month gives last day of the current month
  };

  const handleChangeDate = (type) => {
    let day = parseInt(currentDay, 10);
    let month = parseInt(currentMonth, 10);
    let year = currentYear;

    if (type === "previous") {
      day -= 1;
      if (day <= 0) {
        month -= 1;
        if (month <= 0) {
          month = 12;
          year -= 1;
        }
        day = getDaysInMonth(year, month); // Set to last day of previous month
      }
    } else {
      day += 1;
      const daysInMonth = getDaysInMonth(year, month);
      if (day > daysInMonth) {
        day = 1;
        month += 1;
        if (month > 12) {
          month = 1;
          year += 1;
        }
      }
    }

    setCurrentYear(year);
    setCurrentMonth(month.toString().padStart(2, "0"));
    setCurrentDay(day.toString().padStart(2, "0"));

    onChangeYear(year);
    onChangeMonth(month.toString().padStart(2, "0"));
    onChangeDate(day.toString().padStart(2, "0"));
  };

  return (
    <div className={cx("date_controller")}>
      <FontAwesomeIcon
        icon={faChevronLeft}
        className={cx("date_controller_icon_next")}
        onClick={() => handleChangeDate("previous")}
      />
      <p className={cx("date_controller_text")}>
        {currentDay}/ {currentMonth}/ {currentYear}
      </p>
      <FontAwesomeIcon
        icon={faChevronRight}
        className={cx("date_controller_icon_previous")}
        onClick={() => handleChangeDate("next")}
      />
    </div>
  );
}

TimeController.propTypes = {
  onChangeDate: PropTypes.func,
  onChangeMonth: PropTypes.func,
  onChangeYear: PropTypes.func,
};
