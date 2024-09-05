import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./SignUp.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import { request } from "../../api/request";

const cx = classNames.bind(styles);

const ACCOUNT_REGEX = /^[A-Za-z0-9]{3,30}$/;
const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PWD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [validUsername, setValidUsername] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [validMessage, setValidMessage] = useState(false);

  useEffect(() => {
    const result = ACCOUNT_REGEX.test(username);
    setValidUsername(result);
  }, [username]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPassword(result);

    const match = confirmPassword === password;
    setValidConfirmPassword(match);
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !validUsername ||
      !validEmail ||
      !validPassword ||
      !validConfirmPassword
    ) {
      setMessage("Please fill in the form correctly");
      setShowMessage(true);
      setValidMessage(false);
      return;
    }

    try {
      const response = await request.post("/auth/register", {
        username,
        password,
        email,
      });

      if (response.status === 201) {
        setMessage("Register successfully");
        setShowMessage(true);
        setValidMessage(true);
      }
    } catch (error) {
      // console.log(error);
      setMessage(error.response.data.error);
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
          <p className={cx("title")}>SignUp</p>
          <div className={cx("input_container")}>
            <FontAwesomeIcon icon={faUser} className={cx("input_icon")} />
            <input
              type="text"
              autoComplete="off"
              spellCheck={false}
              className={cx("input_field")}
              placeholder="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={cx("input_container")}>
            <FontAwesomeIcon icon={faEnvelope} className={cx("input_icon")} />
            <input
              type="text"
              autoComplete="off"
              spellCheck={false}
              className={cx("input_field")}
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
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
          <button className={cx("signup_button")}>Register</button>
          <div className={cx("sign_up_container")}>
            <p className={cx("sign_up_text")}>Already have an account?</p>
            <Link to={"/login"} className={cx("sign_up_link")}>
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

export default SignUp;
