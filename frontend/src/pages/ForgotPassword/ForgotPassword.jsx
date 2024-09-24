import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ForgotPassword.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import { request } from "../../api/request";

const cx = classNames.bind(styles);

const ACCOUNT_REGEX = /^[A-Za-z0-9]{3,30}$/;
const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [validUsername, setValidUsername] = useState(false);
  const [validEmail, setValidEmail] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validUsername || !validEmail) {
      setMessage("Please fill in the form correctly");
      setShowMessage(true);
      setValidMessage(false);
      return;
    }

    try {
      const response = await request.post("/auth/forgot-password", {
        username,
        email,
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
      <form className={cx("forgotpassword_form")} onSubmit={handleSubmit}>
        <div className={cx("container")}>
          <p className={cx("title")}>Forgot Password</p>
          <div className={cx("input_container")}>
            <FontAwesomeIcon icon={faEnvelope} className={cx("input_icon")} />
            <input
              type="text"
              autoComplete="off"
              spellCheck={false}
              className={cx("input_field")}
              placeholder="Username"
              name="text"
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
          <p className={cx("forgotPassword_description_text")}>
            * After sending the email, you should check the inbox from us in
            your personal email to have necessary instructions to retrieve your
            password.
          </p>
          <button className={cx("forgotpassword_button")}>Send</button>
          <div className={cx("forgotpassword_container")}>
            <p className={cx("forgotpassword_text")}>
              Already have an account?
            </p>
            <Link to={"/login"} className={cx("forgotpassword_link")}>
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
