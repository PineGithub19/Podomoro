import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

export const useAuth = () => {
  const navigate = useNavigate();
  let isLoggedIn = false;

  const cookies = new Cookies();
  const token = cookies.get("token");

  const isAuthenticated = !!token;
  isLoggedIn = isAuthenticated;

  if (!isAuthenticated) {
    navigate("/login");
  }

  return isLoggedIn;
};
