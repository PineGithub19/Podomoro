import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./PlantStatus.module.scss";
import { request } from "../../../../api/request";
import Cookies from "universal-cookie";

const cx = classNames.bind(styles);
// const STATUS = ["Study", "Rest", "Entertainment", "Other"];

function PlantStatus({ setCurrentStatusId }) {
  const [activeStatus, setActiveStatus] = useState(0); // active with Id
  const [previousStatus, setPreviousStatus] = useState(0); // with Id
  const [isShowPopup, setIsShowPopup] = useState(false);

  /** Get Tags */
  const [myTags, setMyTags] = useState([]);

  const handleShowPopup = () => {
    setIsShowPopup(!isShowPopup);
  };

  const handleChangeStatus = (prev, id) => {
    setPreviousStatus(prev);
    setActiveStatus(id);
    setIsShowPopup(false);
    setCurrentStatusId(myTags.find((item) => item._id === id).name);
  };

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
          if (response.data.length !== 0) {
            setMyTags(response.data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchGetMyTags();
  }, []);

  useEffect(() => {
    const fetchCurrentTag = async () => {
      try {
        const cookies = new Cookies();
        const token = cookies.get("token");

        const response = await request.get("/tag/current-tag", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setActiveStatus(response.data._id);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (myTags.length !== 0) {
      fetchCurrentTag();
    }
  }, [myTags]);

  useEffect(() => {
    const fetchUpdateTag = async () => {
      const previousId = myTags.find((item) => item._id === previousStatus)._id;
      const activeId = myTags.find((item) => item._id === activeStatus)._id;

      try {
        await request.put(`/tag/edit/${previousId}`, {
          current: false,
        });
        await request.put(`/tag/edit/${activeId}`, {
          current: true,
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (myTags.length !== 0 && previousStatus && activeStatus) {
      fetchUpdateTag();
    }
  }, [activeStatus, myTags, previousStatus]);

  return (
    <div className={cx("plant_status")}>
      {myTags.length !== 0 && (
        <>
          <div
            className={cx("status_dot")}
            style={{
              "--status-dot-color": `${
                myTags.find((item) => item._id === activeStatus)?.color ||
                "#000"
              }`,
            }}
          ></div>
          <div className={cx("status_text")} onClick={handleShowPopup}>
            {myTags.find((item) => item._id === activeStatus)?.name ||
              "No Tags"}
          </div>
        </>
      )}
      {isShowPopup && (
        <div className={cx("popup_status")}>
          <p className={cx("popup_status_header")}>Tags</p>
          <div className={cx("popup_status_body")}>
            {myTags.map((status) => (
              <div
                className={cx("popup_item", {
                  active: activeStatus === status._id,
                })}
                key={status._id}
                onClick={() => handleChangeStatus(activeStatus, status._id)}
              >
                <div
                  className={cx("status_dot")}
                  style={{ "--status-dot-color": `${status.color}` }}
                ></div>
                <div className={cx("popup_item_text")}>{status.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

PlantStatus.propTypes = {
  setCurrentStatusId: PropTypes.func,
};

export default PlantStatus;
