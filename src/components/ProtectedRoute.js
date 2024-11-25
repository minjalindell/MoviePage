import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem("authToken");

  // Jos ei ole authTokenia, ohjaa kirjautumissivulle
  return authToken ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
