import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./FocusedTimeDistribution.module.scss";

// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";

const cx = classNames.bind(styles);

function FocusedTimeDistribution({ data, activeDate = 0 }) {
  const [labels, setLabels] = useState([]);
  const [totalFocusedTime, setTotalFocusedTime] = useState(0);
  const [dataVisualization, setDataVisualization] = useState(data);

  useEffect(() => {
    if (activeDate === 0) {
      setLabels(data.map((_, index) => index));
      setDataVisualization(data);
      setTotalFocusedTime(data.reduce((acc, curr) => acc + curr, 0));
    } else if (activeDate === 1) {
      setLabels([
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ]);
      setDataVisualization(data);
      setTotalFocusedTime(data.reduce((acc, curr) => acc + curr, 0));
    } else if (activeDate === 2) {
      setLabels(data.map((item) => item.date));
      setDataVisualization(data.map((item) => item.totalSeconds));
      setTotalFocusedTime(
        data.reduce((acc, curr) => acc + curr.totalSeconds, 0)
      );
    }
  }, [data, activeDate]);

  return (
    <div className={cx("time_distribution_chart")}>
      <p className={cx("time_distribution_chart_title")}>
        Focused Time Distribution
      </p>
      <div className={cx("time_distribution_chart_statistic")}>
        <p className={cx("time_distribution_chart_statistic_title")}>
          Total focused time:
        </p>
        <p className={cx("time_distribution_chart_statistic_value")}>
          {totalFocusedTime} min
        </p>
      </div>
      <div className={cx("time_distribution_chart_content")}>
        <Bar
          data={{
            labels: labels,
            datasets: [
              {
                label: "Total focused time",
                data: dataVisualization,
                borderRadius: 4,
                backgroundColor: "#50aa8d",
              },
            ],
          }}
        />
      </div>
    </div>
  );
}

FocusedTimeDistribution.propTypes = {
  data: PropTypes.array,
  activeDate: PropTypes.number,
};

export default FocusedTimeDistribution;
