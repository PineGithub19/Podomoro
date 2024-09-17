import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./Note.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef } from "react";
import { request } from "../../../../api/request";
import Cookies from "universal-cookie";

const cx = classNames.bind(styles);

function Note({ handleActiveNote }) {
  const [notes, setNotes] = useState([]);
  const [activeCreateStatus, setActiveCreateStatus] = useState(false);
  const [clickClose, setClickClose] = useState(false);

  // noteCheked and noteDescription are foor the create a note.
  const [noteDescription, setNoteDescription] = useState("");

  const createNoteInputRef = useRef(null);

  useEffect(() => {
    const fetchAllNotes = async () => {
      const cookies = new Cookies();
      const token = cookies.get("token");

      try {
        const response = await request.get("/note/get-notes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setNotes(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllNotes();
  }, []);

  useEffect(() => {
    if (activeCreateStatus) {
      createNoteInputRef.current.focus();
    }
  }, [activeCreateStatus]);

  const handleCreateNewNote = async () => {
    setActiveCreateStatus(true);
  };

  const handleOnBlurCreateNote = async () => {
    if (noteDescription !== "") {
      const cookies = new Cookies();
      const token = cookies.get("token");
      try {
        const response = await request.post(
          "/note/create",
          {
            checked: false,
            description: noteDescription,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status == 201) {
          setNoteDescription("");
          setNotes((prev) => [...prev, response.data]);
          setActiveCreateStatus(false);
        }
      } catch (error) {
        console.log(error);
      }
    } else if (noteDescription === "") {
      setActiveCreateStatus(false);
    }
  };

  const handleOnBlueUpdateNote = async (note) => {
    if (note.description !== "") {
      try {
        const response = await request.put(`/note/update-note/${note._id}`, {
          checked: note.checked,
          description: note.description,
        });
        if (response.status == 200) {
          setNoteDescription("");
          setNotes(
            notes.map((item) => {
              if (item._id === note._id) {
                return {
                  ...item,
                  checked: item.checked,
                  description: item.description,
                };
              }
              return item;
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    } else if (note.description === "") {
      try {
        const response = await request.delete(`/note/delete-note/${note._id}`);
        if (response.status == 200) {
          setNoteDescription("");
          setNotes(notes.filter((item) => item._id !== note._id));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleEditNoteChecked = (noteId) => {
    const updatedNotes = notes.map((note) =>
      note._id === noteId ? { ...note, checked: !note.checked } : note
    );
    setNotes(updatedNotes);
  };

  const handleEditNoteDescription = (event, noteId) => {
    const updatedNotes = notes.map((note) =>
      note._id === noteId ? { ...note, description: event.target.value } : note
    );
    setNotes(updatedNotes);
  };

  const handleCloseNote = () => {
    setClickClose(true);

    setTimeout(() => {
      handleActiveNote(false);
      setClickClose(false);
    }, 480);
  };

  return (
    <div className={cx("overlay")} onClick={handleCloseNote}>
      <div
        className={cx("wrapper", {
          close: clickClose,
        })}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={cx("header")}>
          <p className={cx("note_title")}>Notes</p>
          <FontAwesomeIcon
            className={cx("close_note_icon")}
            icon={faXmark}
            onClick={handleCloseNote}
          />
        </div>
        <div className={cx("body")}>
          {activeCreateStatus && (
            <div className={cx("note_item")}>
              <input
                className={cx("note_check_box")}
                type="checkbox"
                disabled={true}
              />
              <input
                className={cx("note_input")}
                type="text"
                spellCheck={false}
                ref={createNoteInputRef}
                value={noteDescription}
                onChange={(event) => setNoteDescription(event.target.value)}
                onBlur={handleOnBlurCreateNote}
              />
            </div>
          )}
          {notes.map((item) => (
            <div
              className={cx("note_item")}
              key={item._id}
              onBlur={() => handleOnBlueUpdateNote(item)}
            >
              <input
                className={cx("note_check_box")}
                type="checkbox"
                checked={item.checked}
                onChange={() => handleEditNoteChecked(item._id)}
                // onBlur={() => handleOnBlueUpdateNote(item)}
              />
              <input
                className={cx("note_input")}
                type="text"
                spellCheck={false}
                value={item.description}
                onChange={(event) => handleEditNoteDescription(event, item._id)}
                // onBlur={() => handleOnBlueUpdateNote(item)}
              />
            </div>
          ))}
        </div>
        <div className={cx("footer")}>
          <FontAwesomeIcon
            className={cx("add_note_icon")}
            icon={faCirclePlus}
            onClick={handleCreateNewNote}
          />
        </div>
      </div>
    </div>
  );
}

Note.propTypes = {
  handleActiveNote: PropTypes.func,
};

export default Note;
