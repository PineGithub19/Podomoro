import { useState, createContext, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Forest.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import SideBar from "../../components/SideBar";
import ForestBody from "./components/ForestBody/ForestBody";
import OverviewPopup from "./components/OverviewPopup";
import { request } from "../../api/request";
import Cookies from "universal-cookie";

const cx = classNames.bind(styles);

export const CurrentStatuesContext = createContext();

function Forest() {
  const [isActiveSideBar, setIsActiveSideBar] = useState(false);
  const [isOverviewPopup, setIsOverviewPopup] = useState(false);
  // const [commonStatuses, setCommonStatues] = useState([]);
  const [statues, setStatues] = useState([]);

  const [deselectAll, setDeselectAll] = useState(true);

  const handleIsActiveSideBar = () => {
    setIsActiveSideBar(!isActiveSideBar);
  };

  const handleIsOverviewPopup = () => {
    setIsOverviewPopup(!isOverviewPopup);
  };

  // useEffect(() => {
  //   const fetCommonStatuses = async () => {
  //     const cookies = new Cookies();
  //     const token = cookies.get("token");

  //     try {
  //       const response = await request.get("/tag/get-common-tags", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       if (response.status === 200) {
  //         setCommonStatues(response.data.map((item) => item.name));
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetCommonStatuses();
  // }, []);

  useEffect(() => {
    const fetchStatuses = async () => {
      const cookies = new Cookies();
      const token = cookies.get("token");

      try {
        const response = await request.get("/tag/get-tags", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setStatues(response.data.map((item) => item.name));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchStatuses();
  }, []);

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
          deselectAll={deselectAll}
          setDeselectAll={setDeselectAll}
          setIsOverviewPopup={setIsOverviewPopup}
          currentStatues={statues}
          handleChangeCurrentStatuses={setStatues}
        />
      )}
    </>
  );
}

export default Forest;
