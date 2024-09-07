import { useState } from "react";

import HomeHeader from "./components/HomeHeader";
import HomeBody from "./components/HomeBody";

import classNames from "classnames/bind";
import styles from "./Home.module.scss";

const cx = classNames.bind(styles);

function Home() {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className={cx("wrapper")}>
      <HomeHeader isRunning={isRunning} />
      <div className={cx("body")}>
        <HomeBody isRunning={isRunning} setIsRunning={setIsRunning} />
      </div>
    </div>
  );
}

export default Home;
