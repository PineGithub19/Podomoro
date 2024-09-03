// import axios from "axios";
import { useState } from "react";
import HomeHeader from "./components/HomeHeader";
import HomeBody from "./components/HomeBody";

import classNames from "classnames/bind";
import styles from "./Home.module.scss";

const cx = classNames.bind(styles);

function Home() {
  // const [trees, setTrees] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5555/trees")
  //     .then((response) => {
  //       setTrees(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  // useEffect(() => {
  //   console.log(trees);
  // }, [trees]);

  const [isRunning, setIsRunning] = useState(false);

  // const handleIsRunning = () => {
  //   setIsRunning(!isRunning);
  // };

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
