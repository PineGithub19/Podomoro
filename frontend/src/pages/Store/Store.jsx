import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Store.module.scss";
import StorePopup from "./components/StorePopup";
import StoreMusicPopup from "./components/StoreMusicPopup";
import { request } from "../../api/request";

import SideBar from "../../components/SideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCoins } from "@fortawesome/free-solid-svg-icons";
import Cookies from "universal-cookie";

const cx = classNames.bind(styles);

function Store() {
  const [isSideBarActive, setIsSideBarActive] = useState(false);
  const [myTrees, setMyTrees] = useState([]);
  const [trees, setTrees] = useState([]);
  const [treesVisualization, setTreesVisualization] = useState([]);

  const [coins, setMyCoins] = useState(Number(0));

  const [currentMusics, setCurrentMusics] = useState([]);
  const [musics, setMusics] = useState([]);
  const [musicsVisualization, setMusicsVisualization] = useState([]);

  const [activePopup, setActivePopup] = useState(false);
  const [isActivePopup, setIsActivePopup] = useState(null);

  const handleIsActiveSideBar = () => {
    setIsSideBarActive(!isSideBarActive);
  };

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");

    const fetchAllTrees = async () => {
      try {
        const response = await request.get("/trees");

        if (response.status === 200) {
          setTrees(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchMyTrees = async () => {
      try {
        const response = await request.get("/trees/my-tree", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setMyTrees(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCoins = async () => {
      try {
        const response = await request.get("/coin/my-coin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setMyCoins(response.data[0].coin);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchMyMusics = async () => {
      const cookies = new Cookies();
      const token = cookies.get("token");

      try {
        const response = await request.get("/music/current-music", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setCurrentMusics(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchMusics = async () => {
      try {
        const response = await request.get("/music");

        if (response.status === 200) {
          setMusics(currentMusics.concat(response.data.data));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllTrees();
    fetchMyTrees();
    fetchMyMusics();
    fetchMusics();
    fetchCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coins]);

  useEffect(() => {
    if (trees.length === 0 || myTrees.length === 0) {
      return;
    }

    setTreesVisualization(() => {
      const groupedTrees = [];
      for (let i = 0; i < trees.length; i += 2) {
        groupedTrees.push(trees.slice(i, i + 2));
      }
      return groupedTrees;
    });

    if (musics.length === 0) {
      return;
    }

    setMusicsVisualization(() => {
      const groupedMusics = [];
      for (let i = 0; i < musics.length; i += 2) {
        groupedMusics.push(musics.slice(i, i + 2));
      }
      return groupedMusics;
    });
  }, [trees, myTrees, musics]);

  const checkUnlocked = (item) => {
    const res = myTrees.find((tree) => {
      return tree.treeId === item._id;
    });
    return res;
  };

  const checkUnlockedMusic = (item) => {
    const res = musics.find((music) => {
      return music._id === item._id;
    });
    return res;
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
            <p className={cx("header_title")}>Store</p>
            <div className={cx("coins")}>
              <FontAwesomeIcon
                className={cx("header_coin_icon")}
                icon={faCoins}
              />
              <span className={cx("coin_count")}>{coins}</span>
            </div>
            {isSideBarActive && (
              <SideBar
                isSideBarActive={isSideBarActive}
                setIsSideBarActive={setIsSideBarActive}
              />
            )}
          </div>
        </div>
        <div className={cx("body")}>
          {treesVisualization.map((visualItems, visualIndex) => (
            <div className={cx("trees_container")} key={visualIndex}>
              {visualItems.map((item) => (
                <div key={item._id}>
                  <div
                    className={cx("tree_item")}
                    key={item._id}
                    onClick={() => {
                      setActivePopup(true);
                      setIsActivePopup(item._id);
                    }}
                  >
                    <div className={cx("image_container")}>
                      <img
                        className={cx("tree_item_image")}
                        src={item.image}
                        alt={item.name}
                      />
                    </div>
                    <p className={cx("tree_item_name")}>{item.name}</p>
                    <div className={cx("tree_item_footer")}>
                      {checkUnlocked(item) ? (
                        <p className={cx("unlocked")}>Unlocked</p>
                      ) : (
                        <div className={cx("price")}>
                          <p className={cx("price_text")}>{item.price}</p>
                          <FontAwesomeIcon
                            className={cx("price_coin_icon")}
                            icon={faCoins}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {item._id === isActivePopup && activePopup && (
                    <StorePopup
                      handleActivePopup={setActivePopup}
                      isUnlocked={checkUnlocked(item)}
                      coins={coins}
                      handleCoins={setMyCoins}
                      data={item}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
          {musicsVisualization.map((visualItems, visualIndex) => (
            <div className={cx("music_container")} key={visualIndex}>
              {visualItems.map((item) => (
                <div key={item._id}>
                  <div
                    className={cx("music_item")}
                    key={item._id}
                    onClick={() => {
                      setActivePopup(true);
                      setIsActivePopup(item._id);
                    }}
                  >
                    <img
                      className={cx("music_item_image")}
                      src={item.image}
                      alt={item.name}
                    />
                    <p className={cx("music_item_name")}>{item.name}</p>
                    <div className={cx("music_item_footer")}>
                      {checkUnlockedMusic(item) ? (
                        <p className={cx("unlocked")}>Unlocked</p>
                      ) : (
                        <div className={cx("price")}>
                          <p className={cx("price_text")}>{item.coin}</p>
                          <FontAwesomeIcon
                            className={cx("price_coin_icon")}
                            icon={faCoins}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {item._id === isActivePopup && activePopup && (
                    <StoreMusicPopup
                      handleActivePopup={setActivePopup}
                      isUnlocked={checkUnlockedMusic(item)}
                      coins={coins}
                      handleCoins={setMyCoins}
                      data={item}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Store;
