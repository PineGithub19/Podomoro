import classNames from "classnames/bind";
import styles from "./Forest.module.scss";

const cx = classNames.bind(styles);

function Forest() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}></div>
      <div className={cx("body")}></div>
    </div>
  );
}

export default Forest;
