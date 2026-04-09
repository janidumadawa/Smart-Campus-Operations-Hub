import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

//this component checks if the user is authenticated by accessing the user state from the AuthContext. If the user is not authenticated, it redirects them to the login page. If the user is authenticated, it renders the child components passed to it. This allows us to protect certain routes in our application and ensure that only authenticated users can access them.                                                   