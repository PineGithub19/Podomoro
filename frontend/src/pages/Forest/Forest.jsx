import { useState, createContext } from "react";
import classNames from "classnames/bind";
import styles from "./Forest.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import SideBar from "../../components/SideBar";
import ForestBody from "./components/ForestBody/ForestBody";
import OverviewPopup from "./components/OverviewPopup";

const cx = classNames.bind(styles);

export const CurrentStatuesContext = createContext();

function Forest() {
  const [isActiveSideBar, setIsActiveSideBar] = useState(false);
  const [isOverviewPopup, setIsOverviewPopup] = useState(false);
  const [statues, setStatues] = useState([
    "Study",
    "Rest",
    "Entertainment",
    "Other",
  ]);

  const handleIsActiveSideBar = () => {
    setIsActiveSideBar(!isActiveSideBar);
  };

  const handleIsOverviewPopup = () => {
    setIsOverviewPopup(!isOverviewPopup);
  };

  return (
    <>
      <div className={cx("wrapper")}>
        <div className={cx("header")}>
          <div className={cx("header_container")}>
            <FontAwesomeIcon
              icon={faBars}
              className={cx("header_menu_icon")}
              onClick={handleIsActiveSideBar}
            />
            <div className={cx("overview")} onClick={handleIsOverviewPopup}>
              <p className={cx("overview_title")}>Overview</p>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={cx("overview_icon")}
              />
            </div>
            {isActiveSideBar && (
              <SideBar
                isSideBarActive={isActiveSideBar}
                setIsSideBarActive={setIsActiveSideBar}
              />
            )}
          </div>
        </div>
        <div className={cx("body")}>
          <CurrentStatuesContext.Provider value={statues}>
            <ForestBody />
          </CurrentStatuesContext.Provider>
        </div>
      </div>
      {isOverviewPopup && (
        <OverviewPopup
          setIsOverviewPopup={setIsOverviewPopup}
          currentStatues={statues}
          handleChangeCurrentStatuses={setStatues}
        />
      )}
    </>
  );
}

export default Forest;
