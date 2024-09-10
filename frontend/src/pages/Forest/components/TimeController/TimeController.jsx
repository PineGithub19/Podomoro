import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./TimeController.module.scss";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const cx = classNames.bind(styles);
const currentDate = new Date();
const MONTHS = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate(); // 0 day of next month gives last day of the current month
};

// Convert date string to Date object
const getDateFromString = (dateString) => {
  return new Date(dateString);
};

// Function to generate a week based on a start date
const generateWeek = (startDate) => {
  let newWeek = [];
  for (let i = 0; i < 7; i++) {
    let newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + i);
    newWeek.push(newDate.toISOString().split("T")[0]); // Format as YYYY-MM-DD
  }
  return newWeek;
};

function TimeController({
  onChangeDate,
  onChangeMonth,
  onChangeYear,
  activeDate = 0,
  weekRange,
  setWeekRange,
}) {
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(
    (currentDate.getMonth() + 1).toString().padStart(2, "0")
  );
  const [currentDay, setCurrentDay] = useState(
    currentDate.getDate().toString().padStart(2, "0")
  );
  const [previous, setPrevious] = useState(0);

  /** GET BY DAY */
  const [dayVisualixation, setDayVisualization] = useState("");

  /** GET BY WEEK */
  const [weekRangeVisualization, setWeekRangeVisualization] = useState(""); // Ex: September, 1 - 7, 2024

  const handleChangeDate = (type) => {
    let day = parseInt(currentDay, 10);
    let month = parseInt(currentMonth, 10);
    let year = currentYear;
    if (activeDate === 0) {
      if (type === "previous") {
        setPrevious((prev) => prev + 1);

        day -= 1;
        if (day <= 0) {
          month -= 1;
          if (month <= 0) {
            month = 12;
            year -= 1;
          }
          day = getDaysInMonth(year, month); // Set to last day of previous month
        }
      } else if (type === "next") {
        setPrevious((prev) => prev - 1);

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
    } else if (activeDate === 1) {
      const firstDayOfWeek = getDateFromString(weekRange[0]);

      if (type === "previous") {
        setPrevious((prev) => prev - 1);

        // Move to the previous week (subtract 7 days)
        firstDayOfWeek.setDate(firstDayOfWeek.getDate() - 7);
      } else if (type === "next") {
        setPrevious((prev) => prev + 1);

        // Move to the next week (add 7 days)
        firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 7);
      }

      // Generate the new week and update state
      const newWeek = generateWeek(firstDayOfWeek);
      setWeekRange(newWeek);
      setCurrentMonth(firstDayOfWeek.getMonth() + 1);
    }
  };

  useEffect(() => {
    /** DAY */
    if (activeDate === 0) {
      setDayVisualization(
        `${MONTHS[Number(currentMonth)]}, ${currentDay}, ${currentYear}`
      );
    }

    /** WEEK */
    if (activeDate === 1) {
      let result = [];

      if (weekRange.length === 0) {
        const date = new Date(`${currentYear}-${currentMonth}-${currentDay}`);
        const currentDay_ = date.getUTCDate();
        const currentDayOfWeek = date.getUTCDay(); // returns the current day of the week from 0 -> 6: Sun -> Sat

        const startDate = new Date(date);
        startDate.setUTCDate(currentDay_ - currentDayOfWeek);
        startDate.setUTCHours(0, 0, 0, 0);

        for (let i = 0; i < 7; i++) {
          const dayStart = new Date(startDate);
          dayStart.setUTCDate(startDate.getUTCDate() + i);

          result.push(dayStart.toISOString().split("T")[0]);
        }
      } else {
        result = weekRange;
      }

      if (result.length > 0) {
        setWeekRange(result);

        const days = result.map((item) => item.slice(-2));
        setWeekRangeVisualization(
          `${MONTHS[Number(currentMonth)]}, ${days[0]} - ${
            days[6]
          }, ${currentYear}`
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDate, currentDay, currentMonth, currentYear, weekRange]);

  return (
    <div className={cx("date_controller")}>
      <FontAwesomeIcon
        icon={faChevronLeft}
        className={cx("date_controller_icon_next")}
        onClick={() => handleChangeDate("previous")}
      />
      {activeDate === 0 && (
        <p className={cx("date_controller_text")}>{dayVisualixation}</p>
      )}
      {activeDate === 1 && (
        <p className={cx("date_controller_text")}>{weekRangeVisualization}</p>
      )}
      {previous !== 0 && (
        <FontAwesomeIcon
          icon={faChevronRight}
          className={cx("date_controller_icon_previous")}
          onClick={() => handleChangeDate("next")}
        />
      )}
    </div>
  );
}

TimeController.propTypes = {
  onChangeDate: PropTypes.func,
  onChangeMonth: PropTypes.func,
  onChangeYear: PropTypes.func,
  activeDate: PropTypes.number,
  weekRange: PropTypes.array,
  setWeekRange: PropTypes.func,
};

export default TimeController;
