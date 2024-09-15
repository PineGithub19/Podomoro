import PropTypes from "prop-types";
import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./CreateTag.module.scss";
import { request } from "../../../../api/request";
import Cookies from "universal-cookie";

const cx = classNames.bind(styles);

function CreateTag({ tagname, handleDisplayCreateTag }) {
  const [tagName, setTagName] = useState(tagname);
  const [tagColor, setTagColor] = useState("#fff");

  const handleCreateTag = async () => {
    if (!tagName || !tagColor) {
      return;
    }

    const cookies = new Cookies();
    const token = cookies.get("token");

    try {
      const response = await request.post(
        "tag/create",
        {
          name: tagName,
          color: tagColor,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        handleDisplayCreateTag(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={cx("wrapper_create_tag")}
      onClick={() => handleDisplayCreateTag(false)}
    >
      <div
        className={cx("create_tag_container")}
        onClick={(event) => event.stopPropagation()}
      >
        <p className={cx("create_tag_title")}>Create New Tag</p>
        <input
          className={cx("create_tag_name")}
          type="text"
          placeholder="Tag name"
          value={tagName}
          onChange={(event) => setTagName(event.target.value)}
        />
        <input
          className={cx("create_tag_color")}
          type="text"
          placeholder="Tag color (hex, rgba)"
          value={tagColor}
          onChange={(event) => setTagColor(event.target.value)}
        />
        <button className={cx("create_tag_button")} onClick={handleCreateTag}>
          Create
        </button>
      </div>
    </div>
  );
}

CreateTag.propTypes = {
  tagname: PropTypes.string,
  handleDisplayCreateTag: PropTypes.func,
};

export default CreateTag;
