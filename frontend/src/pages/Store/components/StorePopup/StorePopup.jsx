import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./StorePopup.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faXmark } from "@fortawesome/free-solid-svg-icons";
import { request } from "../../../../api/request";
import Cookies from "universal-cookie";

const cx = classNames.bind(styles);

function StorePopup({
  handleActivePopup,
  isUnlocked,
  coins,
  handleCoins,
  data,
}) {
  const [showMessage, setShowMessage] = useState(false);
  const [validMessage, setValidMessage] = useState(false);
  const [message, setMessage] = useState("");

  const handleBuyTree = async () => {
    if (coins < data.price) {
      setValidMessage(false);
      setMessage("not enough money");
      setShowMessage(true);
      return;
    }

    const cookies = new Cookies();
    const token = cookies.get("token");
    try {
      const response = await request.post("/trees/my-tree", {
        token: token,
        treeId: data._id,
        buy: true,
        selected: false,
      });

      if (response.status === 201) {
        const totalCoins = coins - data.price;
        const coinsResponse = await request.put("coin/my-coin", {
          token: token,
          coin: totalCoins,
        });

        if (coinsResponse.status === 200) {
          handleCoins(totalCoins);
          handleActivePopup(false);
          setValidMessage(true);
          setMessage("buy successfully");
          setShowMessage(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  /** Message */

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
  }, [showMessage]);

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
      {showMessage && (
        <div className={cx("message")}>
          <p
            className={cx("message_text", {
              success: validMessage,
              error: !validMessage,
            })}
          >
            {message}
          </p>
          <FontAwesomeIcon
            icon={faXmark}
            className={cx("message_close_icon")}
            onClick={handleCloseMessage}
          />
        </div>
      )}
    </div>
  );
}

StorePopup.propTypes = {
  handleActivePopup: PropTypes.func,
  isUnlocked: PropTypes.object,
  coins: PropTypes.number,
  handleCoins: PropTypes.func,
  data: PropTypes.object,
};

export default StorePopup;
