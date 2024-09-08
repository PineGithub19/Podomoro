import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./HomeBody.module.scss";
import PlantStatus from "../PlantStatus/PlantStatus";
import TreeMenu from "../TreeMenu";
import Cookies from "universal-cookie";
import { request } from "../../../../api/request";

const cx = classNames.bind(styles);
const DEFAULT_MINUTE = 0;
const DEFAULT_SECOND = 5;

function addLeadingZero(value) {
  return value.toString().padStart(2, "0");
}

function HomeBody({ isRunning, setIsRunning }) {
  const [value, setValue] = useState(100);
  const [minuteLeft, setMinuteLeft] = useState(DEFAULT_MINUTE);
  const [secondLeft, setSecondLeft] = useState(DEFAULT_SECOND);
  const [isCanceled, setIsCanceled] = useState(false);
  const [chooseGiveUp, setChooseGiveUp] = useState(false);

  const [startDatePlanting, setStartDatePlanting] = useState(null);
  const [endDatePlanting, setEndDatePlanting] = useState(null);
  const [statusPlanting, setStatusPlanting] = useState("");
  const [currentStatusId, setCurrentStatusId] = useState("Study");
  const [currentTreeId, setCurrentTreeId] = useState(null);

  const [showTreeMenu, setShowTreeMenu] = useState(false);
  const [isCompletePlanting, setIsCompletePlanting] = useState(false);

  const handleIsCanceled = () => {
    setIsCanceled(!isCanceled);
  };

  const handlePlantTree = () => {
    setIsRunning(true);
    setStartDatePlanting(new Date());
  };

  useEffect(() => {
    if (minuteLeft === 0 && secondLeft === 0) {
      setIsRunning(false);
      setIsCanceled(false);
      setIsCompletePlanting(true);
      setEndDatePlanting(new Date());
      setStatusPlanting("Complete");
    }

    if (!isRunning) {
      setMinuteLeft(DEFAULT_MINUTE);
      setSecondLeft(DEFAULT_SECOND);
      setValue(100);

      // if (!isCanceled && chooseGiveUp) {
      //   setChooseGiveUp(false);
      //   setIsCompletePlanting(true);
      // }

      return;
    }

    const timerId = setInterval(() => {
      let time = minuteLeft * 60 + secondLeft;
      time -= 1;
      setMinuteLeft(Math.floor(time / 60));
      setSecondLeft(time % 60);
      setValue((time / (DEFAULT_MINUTE * 60 + DEFAULT_SECOND)) * 100);
    }, 1000);

    return () => clearInterval(timerId);
  }, [
    isCanceled,
    isRunning,
    minuteLeft,
    secondLeft,
    setIsRunning,
    chooseGiveUp,
  ]);

  useEffect(() => {
    if (!isRunning && !isCanceled && chooseGiveUp) {
      setIsCompletePlanting(true);
      setEndDatePlanting(new Date());
      setStatusPlanting("Give up");
    }
  }, [isRunning, isCanceled, chooseGiveUp]);

  useEffect(() => {
    console.log(isCompletePlanting);
  }, [isCompletePlanting]);

  /** TreeMenu */

  const handleShowTreeMenu = () => {
    setShowTreeMenu(!showTreeMenu);
  };

  /** Get default selected tree */

  useEffect(() => {
    const fetchDefaultSelectedTree = async () => {
      try {
        const cookies = new Cookies();
        const token = cookies.get("token");

        const response = await request.get("/trees/my-tree", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const defaultTree = response.data.data.find((item) => item.selected);
          if (defaultTree) {
            setCurrentTreeId(defaultTree.treeId);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDefaultSelectedTree();
  }, []);

  /** Check Complete Planting */

  useEffect(() => {
    const fetchCompletePlanting = async () => {
      const cookies = new Cookies();
      const token = cookies.get("token");
      const duration = DEFAULT_MINUTE * 60 + DEFAULT_SECOND;
      console.log(startDatePlanting, startDatePlanting.toISOString());

      try {
        await request.post("/planting/complete", {
          token: token,
          duration: duration,
          start: startDatePlanting.toISOString(),
          end: endDatePlanting.toISOString(),
          status: statusPlanting,
          tag: currentStatusId,
          treeId: currentTreeId,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsCompletePlanting(false);
      }
    };
    if (!isRunning && isCompletePlanting) {
      fetchCompletePlanting();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompletePlanting]);

  return (
    <>
      <div className={cx("wrapper")}>
        <div className={cx("header")}>
          <p className={cx("welcome_paragraph")}>Start planting today!</p>
        </div>
        <div className={cx("body")}>
          <div className={cx("timer")} onClick={handleShowTreeMenu}>
            <div className={cx("circle")} style={{ "--timer-value": value }}>
              <div className={cx("time")}>
                <p className={cx("minute")}>{addLeadingZero(minuteLeft)}</p>
                <p className={cx("dot")}>:</p>
                <p className={cx("second")}>{addLeadingZero(secondLeft)}</p>
              </div>
            </div>
          </div>
          {showTreeMenu && (
            <TreeMenu
              setShowTreeMenu={setShowTreeMenu}
              setCurrentTreeId={setCurrentTreeId}
            />
          )}
        </div>
        <div className={cx("footer")}>
          <PlantStatus setCurrentStatusId={setCurrentStatusId} />
          {!isRunning ? (
            <button className={cx("plant_btn")} onClick={handlePlantTree}>
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
                  setChooseGiveUp(true);
                }}
              >
                Give up
              </button>
              <button
                className={cx("popup_continue_btn")}
                onClick={() => {
                  setIsCanceled(false);
                  setChooseGiveUp(false);
                }}
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
