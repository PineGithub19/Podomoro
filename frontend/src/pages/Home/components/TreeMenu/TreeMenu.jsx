import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./TreeMenu.module.scss";
import { request } from "../../../../api/request";
import Cookies from "universal-cookie";

const cx = classNames.bind(styles);

function TreeMenu({ setShowTreeMenu, setCurrentTreeId }) {
  /** Call API to get all trees */
  const [trees, setTrees] = useState([]);
  const [activeTree, setActiveTree] = useState(null);
  const [treeIds, setTreeIds] = useState([]);

  useEffect(() => {
    const fetchTrees = async () => {
      try {
        const cookies = new Cookies();
        const token = cookies.get("token");

        const response = await request.get("/trees/my-tree", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setTreeIds(response.data.data.map((item) => item.treeId));

          const selectedTree = response.data.data.find((item) => item.selected);
          if (selectedTree) {
            setCurrentTreeId(selectedTree.treeId);
          }

          setActiveTree(() => {
            const selectedIndex = response.data.data.findIndex(
              (item) => item.selected
            );
            return selectedIndex !== -1 ? selectedIndex : null;
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTrees();
  }, [setCurrentTreeId]);

  useEffect(() => {
    const fetchTreesByActiveTree = async () => {
      try {
        const treesResponse = await Promise.all(
          treeIds.map((id) => request.get(`/trees/${id}`))
        );
        if (treesResponse.every((item) => item.status === 200)) {
          setTrees(treesResponse.map((item) => item.data));
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (treeIds.length > 0) {
      fetchTreesByActiveTree();
    }
  }, [treeIds]);

  const handleChooseTrees = (event) => {
    event.stopPropagation();
  };

  const handleChooseActiveTree = async (prevIndex, currIndex) => {
    setActiveTree(currIndex);
    setCurrentTreeId(trees[currIndex]._id);

    try {
      await request.put(`/trees/my-tree/${trees[prevIndex]._id}`, {
        selected: false,
      });
      await request.put(`/trees/my-tree/${trees[currIndex]._id}`, {
        selected: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={cx("wrapper")} onClick={() => setShowTreeMenu(false)}>
      <div
        className={cx("container")}
        onClick={(event) => handleChooseTrees(event)}
      >
        <div className={cx("header")}>
          <p className={cx("header_title")}>Trees</p>
        </div>
        <div className={cx("trees_row")}>
          {trees.map((tree, index) => (
            <div
              className={cx("tree_information", {
                active: index === activeTree,
              })}
              key={tree._id}
              onClick={() => handleChooseActiveTree(activeTree, index)}
            >
              <img
                src={tree.image}
                alt={tree.name}
                className={cx("tree_image")}
              />
              <p className={cx("tree_name")}>{tree.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

TreeMenu.propTypes = {
  setShowTreeMenu: PropTypes.func,
  setCurrentTreeId: PropTypes.func,
};

export default TreeMenu;
