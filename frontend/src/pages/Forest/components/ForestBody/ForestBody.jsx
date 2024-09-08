import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ForestBody.module.scss";
import { request } from "../../../../api/request";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTree } from "@fortawesome/free-solid-svg-icons";

import { TimeController } from "../TimeController";
import FocusedTimeDistribution from "../FocusedTimeDistribution/FocusedTimeDistribution";
import TagDistribution from "../TagDistribution/TagDistribution";
import Cookies from "universal-cookie";

const cx = classNames.bind(styles);

const DATE_ITEMS = ["Day", "Week", "Month", "Year"]; // 0 -> 3
const currentDate = new Date();

function ForestBody() {
  const [activeDate, setActiveDate] = useState(0);
  const [plantings, setPlantings] = useState([]);

  /** TimeZone */
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(
    (currentDate.getMonth() + 1).toString().padStart(2, "0")
  );
  const [currentDay, setCurrentDay] = useState(
    currentDate.getDate().toString().padStart(2, "0")
  );

  const handleChangeDate = (index) => {
    setActiveDate(index);
  };

  /** Platings */
  const [totalCountPlanting, setTotalCountPlanting] = useState(0);
  const [aliveTrees, setAliveTrees] = useState(0);

  // For charts
  const [hourlyPlantings, setHourlyPlantings] = useState([]);
  const [tagsFrequency, setTagsFrequency] = useState({});

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");

    const fetchPlatings = async () => {
      try {
        const response = await request.get("/planting/get-by-day", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            date: currentDate,
          },
        });

        if (response.status === 200) {
          setPlantings(response.data.data);
          setTotalCountPlanting(response.data.count);
        }
      } catch (error) {
        console.log(error);
      }

      try {
        const response = await request.get("/planting/get-by-hours", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            date: currentDate,
          },
        });

        if (response.status === 200) {
          setHourlyPlantings(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPlatings();
  }, [currentYear, currentMonth, currentDay]);

  /** Statistic */
  const [treePlantingCounts, setTreePlantingCounts] = useState({});
  const [treeFrequencyVisualization, setTreeFrequencyVisualization] = useState(
    []
  );
  const [tagMinutesCounts, setTagMinutesCounts] = useState({});
  const [favoriteTrees, setFavoriteTrees] = useState([]); // Favorite Trees

  useEffect(() => {
    // Count planting of each tree
    const newTreePlantingCounts = plantings.reduce((acc, planting) => {
      acc[planting.treeId] = (acc[planting.treeId] || 0) + 1;
      return acc;
    }, {});

    setTreePlantingCounts(newTreePlantingCounts);

    // Count alive trees
    const aliveTreesCounts = plantings.reduce((acc, planting) => {
      if (planting.status === "Complete") {
        acc++;
      }
      return acc;
    }, 0);

    setAliveTrees(aliveTreesCounts);

    // Count planting of each tag
    const newTags = plantings.reduce((acc, planting) => {
      acc[planting.tag] = (acc[planting.tag] || 0) + 1;
      return acc;
    }, {});

    setTagsFrequency(newTags);

    // Count minutes of each tag
    const newTagMinutes = plantings.reduce((acc, planting) => {
      const end = new Date(planting.end);
      const start = new Date(planting.start);
      const duration = Math.floor((end - start) / 1000);
      acc[planting.tag] = (acc[planting.tag] || 0) + duration;
      return acc;
    }, {});

    setTagMinutesCounts(newTagMinutes);
  }, [plantings]);

  useEffect(() => {
    const fetchTrees = async () => {
      const treesResponse = await Promise.all(
        Object.keys(treePlantingCounts).map((treeId) =>
          request.get(`/trees/${treeId}`)
        )
      );
      setTreeFrequencyVisualization(treesResponse.map((tree) => tree.data));
    };

    fetchTrees();
  }, [treePlantingCounts]);

  /** Get favorite trees by order */
  useEffect(() => {
    if (Object.keys(treePlantingCounts).length > 0) {
      const orderFavoriteTreesById = Object.keys(treePlantingCounts).sort(
        (a, b) => treePlantingCounts[b] - treePlantingCounts[a]
      );

      const sortedFavoriteTrees = treeFrequencyVisualization.sort((a, b) => {
        const aKey = Object.keys(a).find((key) =>
          orderFavoriteTreesById.includes(key)
        );
        const bKey = Object.keys(b).find((key) =>
          orderFavoriteTreesById.includes(key)
        );

        return (
          orderFavoriteTreesById.indexOf(aKey) -
          orderFavoriteTreesById.indexOf(bKey)
        );
      });

      setFavoriteTrees(sortedFavoriteTrees);
    }
  }, [treePlantingCounts, treeFrequencyVisualization]);

  // useEffect(() => {
  //   console.log(favoriteTrees);
  // }, [favoriteTrees]);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("time_distribution")}>
        <div className={cx("time_distribution_header")}>
          <div className={cx("date_container")}>
            {DATE_ITEMS.map((item, index) => (
              <div
                className={cx("date_item", { active: index === activeDate })}
                key={index}
                onClick={() => handleChangeDate(index)}
              >
                {item}
              </div>
            ))}
          </div>
          <TimeController
            onChangeYear={setCurrentYear}
            onChangeMonth={setCurrentMonth}
            onChangeDate={setCurrentDay}
          />
          <div className={cx("view_trees_container")}>
            {treeFrequencyVisualization.map((item) => (
              <div className={cx("view_trees_item")} key={item._id}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={cx("tree_avatar")}
                />
                <div className={cx("view_trees_item_info")}>
                  <p className={cx("view_trees_item_name")}>{item.name}</p>
                  <div className={cx("view_trees_item_progress_container")}>
                    <div
                      className={cx("view_trees_item_progress")}
                      style={{
                        "--progress-value": `${
                          (treePlantingCounts[item._id] / totalCountPlanting) *
                          100
                        }%`,
                      }}
                    ></div>
                    <p className={cx("view_trees_item_count")}>
                      {treePlantingCounts[item._id]} times
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={cx("view_trees_footer")}>
            <div className={cx("view_trees")}>
              <FontAwesomeIcon icon={faTree} className={cx("view_tree_icon")} />
              <span className={cx("view_tree_value")}>{aliveTrees}</span>
            </div>
            <div className={cx("analyze_tree")}>
              <FontAwesomeIcon
                icon={faTree}
                className={cx("analyze_tree_icon")}
              />
              <span className={cx("analyze_tree_value")}>
                {totalCountPlanting - aliveTrees}
              </span>
            </div>
          </div>
        </div>
        <FocusedTimeDistribution data={hourlyPlantings} />
      </div>
      <TagDistribution
        tagsFrequency={tagsFrequency}
        tagMinutesCounts={tagMinutesCounts}
      />
      <div className={cx("favorite_trees")}>
        <p className={cx("favorite_trees_title")}>Favorite Trees</p>
        {favoriteTrees.map((item, index) => (
          <div className={cx("favorite_trees_item")} key={item._id}>
            <p className={cx("favorite_trees_item_order")}>{index + 1}.</p>
            <img
              src={item.image}
              alt={item.name}
              className={cx("favorite_trees_item_avatar")}
            />
            <div className={cx("favorite_trees_item_info")}>
              <p className={cx("favorite_trees_item_name")}>{item.name}</p>
              <div className={cx("favorite_trees_item_progress_container")}>
                <div
                  className={cx("favorite_trees_item_progress")}
                  style={{
                    "--progress-all-value": `${
                      (treePlantingCounts[item._id] / totalCountPlanting) * 100
                    }%`,
                  }}
                ></div>
                <p className={cx("favorite_trees_item_count")}>
                  {treePlantingCounts[item._id]
                    ? treePlantingCounts[item._id]
                    : 0}{" "}
                  times
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForestBody;
