import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./PlantStatus.module.scss";
import { request } from "../../../../api/request";
import Cookies from "universal-cookie";

const cx = classNames.bind(styles);
const STATUS = ["Study", "Rest", "Entertainment", "Other"];

function PlantStatus({ setCurrentStatusId }) {
  const [activeStatus, setActiveStatus] = useState(0);
  const [isShowPopup, setIsShowPopup] = useState(false);

  /** Get Tags */
  const [myTags, setMyTags] = useState([]);
  const [commonTags, setCommonTags] = useState([]);

  const handleShowPopup = () => {
    setIsShowPopup(!isShowPopup);
  };

  const handleChangeStatus = (index) => {
    setActiveStatus(index);
    setIsShowPopup(false);
    setCurrentStatusId(myTags[index].name);
  };

  useEffect(() => {
    const fetchGetCommonTags = async () => {
      try {
        const response = await request.get("/tag/get-common-tags");

        if (response.status === 200) {
          setCommonTags(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchGetCommonTags();
  }, []);

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
          setMyTags(commonTags.concat(response.data));
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (commonTags.length > 0) {
      fetchGetMyTags();
    }
  }, [commonTags]);

  return (
    <div className={cx("plant_status")}>
      {myTags.length !== 0 ? (
        <>
          <div
            className={cx("status_dot")}
            style={{ "--status-dot-color": `${myTags[activeStatus].color}` }}
          ></div>
          <div className={cx("status_text")} onClick={handleShowPopup}>
            {myTags[activeStatus].name}
          </div>
        </>
      ) : (
        <>
          <div
            className={cx("status_dot")}
            style={{ "--status-dot-color": "#00ffff" }}
          ></div>
          <div className={cx("status_text")} onClick={handleShowPopup}>
            {STATUS[activeStatus]}
          </div>
        </>
      )}
      {isShowPopup && (
        <div className={cx("popup_status")}>
          <p className={cx("popup_status_header")}>Tags</p>
          <div className={cx("popup_status_body")}>
            {myTags.map((status, index) => (
              <div
                className={cx("popup_item", {
                  active: activeStatus === index,
                })}
                key={status._id}
                onClick={() => handleChangeStatus(index)}
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
