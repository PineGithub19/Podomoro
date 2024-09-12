import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./StorePopup.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { request } from "../../../../api/request";
import Cookies from "universal-cookie";

const cx = classNames.bind(styles);

function StorePopup({ handleActivePopup, isUnlocked, data }) {
  const handleBuyTree = async () => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    try {
      const response = await request.post("/trees/my-tree", {
        token: token,
        treeId: data._id,
        buy: true,
        selected: false,
      });

      if (response.status === 200) {
        handleActivePopup(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={cx("wrapper")} onClick={() => handleActivePopup(false)}>
      <div className={cx("container")} onClick={(e) => e.stopPropagation()}>
        <div className={cx("avatar_container")}>
          <img className={cx("avatar")} src={data.image} alt={data.name} />
        </div>
        <p className={cx("title")}>{data.name}</p>
        <p className={cx("description")}>{data.description}</p>
        {isUnlocked ? (
          <p className={cx("unlocked")}>Unlocked</p>
        ) : (
          <div className={cx("price")} onClick={handleBuyTree}>
            <p className={cx("price_text")}>{data.price}</p>
            <FontAwesomeIcon className={cx("price_coin_icon")} icon={faCoins} />
          </div>
        )}
      </div>
    </div>
  );
}

StorePopup.propTypes = {
  handleActivePopup: PropTypes.func,
  isUnlocked: PropTypes.bool,
  data: PropTypes.object,
};

export default StorePopup;
