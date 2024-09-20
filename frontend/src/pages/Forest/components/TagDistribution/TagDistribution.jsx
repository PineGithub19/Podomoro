import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./TagDistribution.module.scss";
import { request } from "../../../../api/request";
import Cookies from "universal-cookie";

// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from "chart.js";
import { Doughnut } from "react-chartjs-2";

const cx = classNames.bind(styles);

function TagDistribution({ tagsFrequency, tagMinutesCounts }) {
  const [totalTagsFrequency, setTotalTagsFrequency] = useState(0);
  const [sortedTagsFrequency, setSortedTagsFrequency] = useState({});

  /** Get Tags */
  const [myTags, setMyTags] = useState([]);
  // const [commonTags, setCommonTags] = useState([]);

  // useEffect(() => {
  //   const fetchGetCommonTags = async () => {
  //     const cookies = new Cookies();
  //     const token = cookies.get("token");

  //     try {
  //       const response = await request.get("/tag/get-common-tags", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       if (response.status === 200) {
  //         console.log(response.data);
  //         setCommonTags(response.data);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchGetCommonTags();
  // }, []);

  useEffect(() => {
    const fetchGetMyTags = async () => {
      const cookies = new Cookies();
      const token = cookies.get("token");

      try {
        const response = await request.get("/tag/get-tags", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setMyTags(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchGetMyTags();
  }, []);

  useEffect(() => {
    const STATUS = myTags.map((item) => item.name);
    const sortedObject = STATUS.reduce((acc, currentKey) => {
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
  }, [myTags, tagsFrequency]);

  return (
    <div className={cx("tag_distribution")}>
      <p className={cx("tag_distribution_title")}>Tag Distribution</p>
      <div className={cx("tag_distribution_chart")}>
        {Object.keys(sortedTagsFrequency).length > 0 && (
          <Doughnut
            data={{
              labels: myTags.map((item) => item.name),
              datasets: [
                {
                  label: Object.keys(sortedTagsFrequency),
                  data: Object.values(sortedTagsFrequency),
                  backgroundColor: myTags.map((item) => item.color),
                },
              ],
            }}
          />
        )}
      </div>
      <div className={cx("tag_distribution_categories")}>
        {myTags.map((item) => (
          <div className={cx("tag_distribution_item_container")} key={item._id}>
            <div className={cx("tag_distribution_item")}>
              <div
                className={cx("tag_distribution_item_dot")}
                style={{ "--tag-distribution-item-dot-color": `${item.color}` }}
              ></div>
              <p className={cx("tag_distribution_item_text")}>{item.name}</p>
            </div>
            <div className={cx("tag_distribution_statistic")}>
              <p className={cx("tag_distribution_statistic_percentage")}>
                {(
                  (sortedTagsFrequency[item.name] / totalTagsFrequency) *
                  100
                ).toFixed(2)}{" "}
                %
              </p>
              <p className={cx("tag_distribution_statistic_value")}>
                {tagMinutesCounts[item.name] ? tagMinutesCounts[item.name] : 0}{" "}
                M
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
