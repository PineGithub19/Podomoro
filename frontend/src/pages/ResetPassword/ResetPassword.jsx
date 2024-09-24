import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ResetPassword.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import { request } from "../../api/request";

const cx = classNames.bind(styles);

const PWD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

function ResetPassword() {
  const { id, resetString } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [validPassword, setValidPassword] = useState(false);
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [validMessage, setValidMessage] = useState(false);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPassword(result);

    const match = confirmPassword === password;
    setValidConfirmPassword(match);
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validPassword || !validConfirmPassword) {
      setMessage("Please fill in the form correctly");
      setShowMessage(true);
      setValidMessage(false);
      return;
    }

    try {
      const response = await request.post("/auth/reset-password", {
        userId: id,
        resetString: resetString,
        newPassword: password,
      });

      if (response.status === 200) {
        setMessage(response.data.message);
        setShowMessage(true);
        setValidMessage(true);
      }
    } catch (error) {
      setMessage(error.response.data.message);
      setShowMessage(true);
      setValidMessage(false);
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
    <div className={cx("wrapper")}>
      <form className={cx("signup_form")} onSubmit={handleSubmit}>
        <div className={cx("container")}>
          <p className={cx("title")}>Reset Password</p>

          <div className={cx("input_container")}>
            <FontAwesomeIcon icon={faLock} className={cx("input_icon")} />
            <input
              type="password"
              autoComplete="off"
              spellCheck={false}
              className={cx("input_field")}
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={cx("input_container")}>
            <FontAwesomeIcon icon={faLock} className={cx("input_icon")} />
            <input
              type="password"
              autoComplete="off"
              spellCheck={false}
              className={cx("input_field")}
              placeholder="Confirm Password"
              name="confirm_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <p className={cx("instruction_description")}>
            * Your new password must:
          </p>
          <ul className={cx("instruction_list")}>
            <li className={cx("instruction_item")}>
              Contains at least one digit.
            </li>
            <li className={cx("instruction_item")}>
              Contains at least one special character from !@#$%^&*.
            </li>
            <li className={cx("instruction_item")}>
              Has a length between 6 and 16 characters.
            </li>
            <li className={cx("instruction_item")}>
              Consists only of letters (uppercase or lowercase), digits, and the
              specified special characters.
            </li>
          </ul>
          <button className={cx("resetpassword_button")}>Register</button>
          <div className={cx("resetpassword_container")}>
            <p className={cx("resetpassword_text")}>Already have an account?</p>
            <Link to={"/login"} className={cx("resetpassword_link")}>
              Login here
            </Link>
          </div>
        </div>
      </form>
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

export default ResetPassword;
