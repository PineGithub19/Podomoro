import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import Cookies from "universal-cookie";

import { request } from "../../api/request";

const cx = classNames.bind(styles);

function LogIn() {
  const navigateHome = useNavigate();

  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [validMessage, setValidMessage] = useState(false);

  const [isCookie, setIsCookie] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await request.post("/auth/login", {
        username: e.target.username.value,
        password: e.target.password.value,
      });

      if (response.status === 200) {
        const cookies = new Cookies();
        cookies.set("token", response.data.accessToken);
        setIsCookie(true);

        // navigateHome("/home");
      }
    } catch (error) {
      setMessage(error.response.data.error);
      setValidMessage(false);
      setShowMessage(true);
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

  /** Handle data for newbie */

  useEffect(() => {
    const createTreeForNewbie = async (token) => {
      try {
        await request.post(
          "/trees/create-newbie",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    };

    const createTagsForNewbie = async (token) => {
      try {
        const tags = [
          {
            name: "Study",
            color: "#00ffff",
          },
          {
            name: "Rest",
            color: "#87ceeb",
          },
          {
            name: "Entertainment",
            color: "#98fb98",
          },
          {
            name: "Other",
            color: "#ff5733",
          },
        ];

        await Promise.all(
          tags.map((item) =>
            request.post(
              "/tag/create-newbie",
              {
                name: item.name,
                color: item.color,
                current: false,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
          )
        );
      } catch (error) {
        console.log(error);
      }
    };

    const createMusicForNewbie = async (token) => {
      try {
        await request.post(
          "/music/create-newbie",
          {},
          {
            headers: {
              Authorization: `Beaer ${token}`,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    };

    const createCoinForNewbie = async (token) => {
      try {
        await request.post(
          "/coin/my-coin-newbie",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    };

    if (isCookie) {
      const cookies = new Cookies();
      const token = cookies.get("token");

      createTagsForNewbie(token);
      createTreeForNewbie(token);
      createMusicForNewbie(token);
      createCoinForNewbie(token);
      navigateHome("/home");
    }
  }, [isCookie, navigateHome]);

  return (
    <div className={cx("wrapper")}>
      <form className={cx("login_form")} onSubmit={handleSubmit}>
        <div className={cx("container")}>
          <p className={cx("title")}>Login</p>
          <div className={cx("input_container")}>
            <FontAwesomeIcon icon={faUser} className={cx("input_icon")} />
            <input
              type="text"
              spellCheck={false}
              className={cx("input_field")}
              placeholder="Username"
              name="username"
            />
          </div>
          <div className={cx("input_container")}>
            <FontAwesomeIcon icon={faLock} className={cx("input_icon")} />
            <input
              type="password"
              spellCheck={false}
              className={cx("input_field")}
              placeholder="Password"
              name="password"
            />
          </div>
          <div className={cx("password_container")}>
            <div className={cx("remember_me")}>
              <input type="checkbox" className={cx("checkbox_remember_me")} />
              <p className={cx("remember_me_text")}>Remember me</p>
            </div>
            <p className={cx("forgot_password")}>Forgot password?</p>
          </div>
          <button className={cx("login_button")}>Login</button>
          <div className={cx("sign_up_container")}>
            <p className={cx("sign_up_text")}>Don&apos;t have an account?</p>
            <Link to={"/signup"} className={cx("sign_up_link")}>
              Register here
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

export default LogIn;
