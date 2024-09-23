import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function ProtectRoute({ element }) {
  const isLoggedIn = useAuth();
  return isLoggedIn ? element : <Navigate to="/login" />;
}

ProtectRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default ProtectRoute;
