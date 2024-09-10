import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./TagDistribution.module.scss";

// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from "chart.js";
import { Doughnut } from "react-chartjs-2";

const cx = classNames.bind(styles);
const PLANT_STATUS = ["Study", "Rest", "Entertainment", "Other"]; // 0 -> 3

function TagDistribution({ tagsFrequency, tagMinutesCounts }) {
  const [totalTagsFrequency, setTotalTagsFrequency] = useState(0);
  const [sortedTagsFrequency, setSortedTagsFrequency] = useState({});

  useEffect(() => {
    const sortedObject = PLANT_STATUS.reduce((acc, currentKey) => {
      if (Object.prototype.hasOwnProperty.call(tagsFrequency, currentKey)) {
        acc[currentKey] = tagsFrequency[currentKey];
      } else {
        acc[currentKey] = 0;
      }
      return acc;
    }, {});

    if (Object.keys(sortedObject).length > 0) {
      setSortedTagsFrequency(sortedObject);
    }

    setTotalTagsFrequency(
      Object.values(tagsFrequency).reduce((acc, curr) => acc + curr, 0)
    );
  }, [tagsFrequency]);

  return (
    <div className={cx("tag_distribution")}>
      <p className={cx("tag_distribution_title")}>Tag Distribution</p>
      <div className={cx("tag_distribution_chart")}>
        {Object.keys(sortedTagsFrequency).length > 0 && (
          <Doughnut
            data={{
              labels: ["Study", "Rest", "Entertainment", "Other"],
              datasets: [
                {
                  label: Object.keys(sortedTagsFrequency),
                  data: Object.values(sortedTagsFrequency),
                  backgroundColor: ["#00ffff", "#87ceeb", "#98fb98", "#ff5733"],
                },
              ],
            }}
          />
        )}
      </div>
      <div className={cx("tag_distribution_categories")}>
        {PLANT_STATUS.map((item, index) => (
          <div className={cx("tag_distribution_item_container")} key={index}>
            <div className={cx("tag_distribution_item")}>
              <div
                className={cx("tag_distribution_item_dot", {
                  study: index === 0,
                  rest: index === 1,
                  entertainment: index === 2,
                  other: index === 3,
                })}
              ></div>
              <p className={cx("tag_distribution_item_text")}>{item}</p>
            </div>
            <div className={cx("tag_distribution_statistic")}>
              <p className={cx("tag_distribution_statistic_percentage")}>
                {(
                  (sortedTagsFrequency[item] / totalTagsFrequency) *
                  100
                ).toFixed(2)}{" "}
                %
              </p>
              <p className={cx("tag_distribution_statistic_value")}>
                {tagMinutesCounts[item] ? tagMinutesCounts[item] : 0} M
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

TagDistribution.propTypes = {
  tagsFrequency: PropTypes.object.isRequired,
  tagMinutesCounts: PropTypes.object.isRequired,
};

export default TagDistribution;
