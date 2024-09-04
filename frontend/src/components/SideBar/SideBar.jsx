import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./SideBar.module.scss";
import classNames from "classnames/bind";
import {
  faGear,
  faHouse,
  faNewspaper,
  faRightFromBracket,
  faStore,
  faTag,
  faTree,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

const cx = classNames.bind(styles);

const MENU = [
  {
    item: "Home",
    icon: <FontAwesomeIcon icon={faHouse} className={cx("menu_icon")} />,
    to: "/",
  },
  {
    item: "Forest",
    icon: <FontAwesomeIcon icon={faTree} className={cx("menu_icon")} />,
    to: "/forest",
  },
  {
    item: "Tags",
    icon: <FontAwesomeIcon icon={faTag} className={cx("menu_icon")} />,
    to: "/tags",
  },
  {
    item: "Store",
    icon: <FontAwesomeIcon icon={faStore} className={cx("menu_icon")} />,
    to: "/store",
  },
  {
    item: "News",
    icon: <FontAwesomeIcon icon={faNewspaper} className={cx("menu_icon")} />,
    to: "/news",
  },
  {
    item: "Settings",
    icon: <FontAwesomeIcon icon={faGear} className={cx("menu_icon")} />,
    to: "/settings",
  },
  {
    item: "Log out",
    icon: (
      <FontAwesomeIcon icon={faRightFromBracket} className={cx("menu_icon")} />
    ),
    to: "/login",
  },
];

function SideBar({ isSideBarActive, setIsSideBarActive }) {
  const [isActive, setIsActive] = useState(isSideBarActive);

  const handleCloseSideBar = () => {
    setIsActive(false);
    setTimeout(() => {
      setIsSideBarActive(false);
    }, 200);
  };

  useEffect(() => {
    console.log(isActive);
  }, [isActive]);

  return (
    <div
      className={cx("wrapper", {
        active: isActive,
      })}
    >
      <div
        className={cx("sidebar_container", {
          active: isActive,
        })}
      >
        <div className={cx("sidebar_header")}>
          <FontAwesomeIcon
            icon={faXmark}
            className={cx("sidebar_close_icon")}
            onClick={handleCloseSideBar}
          />
        </div>
        <div className={cx("sidebar_body")}>
          {MENU.map((item, index) => (
            <Link to={item.to} className={cx("sidebar_menu_item")} key={index}>
              {item.icon}
              <span className={cx("menu_item_text")}>{item.item}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

SideBar.propTypes = {
  isSideBarActive: PropTypes.bool,
  setIsSideBarActive: PropTypes.func,
};

export default SideBar;
