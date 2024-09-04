import classNames from "classnames/bind";
import styles from "./SignUp.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function SignUp() {
  return (
    <div className={cx("wrapper")}>
      <form className={cx("signup_form")}>
        <div className={cx("container")}>
          <p className={cx("title")}>SignUp</p>
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
          <div className={cx("input_container")}>
            <FontAwesomeIcon icon={faLock} className={cx("input_icon")} />
            <input
              type="password"
              spellCheck={false}
              className={cx("input_field")}
              placeholder="Confirm Password"
              name="confirm_password"
            />
          </div>
          <button className={cx("signup_button")}>Signup</button>
          <div className={cx("sign_up_container")}>
            <p className={cx("sign_up_text")}>Already have an account?</p>
            <p className={cx("sign_up_link")}>Login here</p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
