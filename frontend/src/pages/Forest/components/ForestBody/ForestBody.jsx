import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./ForestBody.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTree } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

const DATE_ITEMS = ["Day", "Week", "Month", "Year"];
const PLANT_STATUS = ["Study", "Rest", "Entertainment", "Other"];

function ForestBody() {
  const [activeDate, setActiveDate] = useState(0);

  const handleChangeDate = (index) => {
    setActiveDate(index);
  };

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
          <div className={cx("date_controller")}>date controller</div>
          <div className={cx("view_trees_container")}>
            <div className={cx("view_trees_item")}>
              <img
                src="https://static.vecteezy.com/system/resources/previews/021/731/700/non_2x/nice-beautiful-mango-tree-with-transparent-background-free-png.png"
                alt=""
                className={cx("tree_avatar")}
              />
              <div className={cx("view_trees_item_info")}>
                <p className={cx("view_trees_item_name")}>Mango</p>
                <div className={cx("view_trees_item_progress_container")}>
                  <div
                    className={cx("view_trees_item_progress")}
                    style={{ "--progress-value": "80%" }}
                  ></div>
                  <p className={cx("view_trees_item_count")}>0 times</p>
                </div>
              </div>
            </div>
          </div>
          <div className={cx("view_trees_footer")}>
            <div className={cx("view_trees")}>
              <FontAwesomeIcon icon={faTree} className={cx("view_tree_icon")} />
              <span className={cx("view_tree_value")}>0</span>
            </div>
            <div className={cx("analyze_tree")}>
              <FontAwesomeIcon
                icon={faTree}
                className={cx("analyze_tree_icon")}
              />
              <span className={cx("analyze_tree_value")}>0</span>
            </div>
          </div>
        </div>
        <div className={cx("time_distribution_chart")}>
          <p className={cx("time_distribution_chart_title")}>
            Focused Time Distribution
          </p>
          <div className={cx("time_distribution_chart_statistic")}>
            <p className={cx("time_distribution_chart_statistic_title")}>
              Total focused time:
            </p>
            <p className={cx("time_distribution_chart_statistic_value")}>
              0 min
            </p>
          </div>
          <div className={cx("time_distribution_chart_content")}></div>
        </div>
      </div>
      <div className={cx("tag_distribution")}>
        <p className={cx("tag_distribution_title")}>Tag Distribution</p>
        <div className={cx("tag_distribution_chart")}></div>
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
                  50 %
                </p>
                <p className={cx("tag_distribution_statistic_value")}>150 M</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={cx("favorite_trees")}>
        <p className={cx("favorite_trees_title")}>Favorite Trees</p>
        <div className={cx("favorite_trees_item")}>
          <p className={cx("favorite_trees_item_order")}>1.</p>
          <img
            src="https://static.vecteezy.com/system/resources/previews/021/731/700/non_2x/nice-beautiful-mango-tree-with-transparent-background-free-png.png"
            alt=""
            className={cx("favorite_trees_item_avatar")}
          />
          <div className={cx("favorite_trees_item_info")}>
            <p className={cx("favorite_trees_item_name")}>Mango</p>
            <div className={cx("favorite_trees_item_progress_container")}>
              <div
                className={cx("favorite_trees_item_progress")}
                style={{ "--progress-all-value": "100%" }}
              ></div>
              <p className={cx("favorite_trees_item_count")}>0 times</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForestBody;
