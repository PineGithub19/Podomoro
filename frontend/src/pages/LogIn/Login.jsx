import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function LogIn() {
  return (
    <div className={cx("wrapper")}>
      <form className={cx("login_form")}>
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
            <p className={cx("sign_up_link")}>Register here</p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LogIn;
