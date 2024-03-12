/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  //destructure the token and role from the authContect
  const { token, role } = useContext(authContext);

  //user is allowed to access the route based on their role
  const isAllowed = allowedRoles.includes(role);

  //what makes route based on two conditions like if valid user token and userrole is allowed
  //if its true we render 'children'= the route content , other wise navigate to login
  //we set replace true to replace the currentURL in the history tag

  const accessibleRoute =
    token && isAllowed ? children : <Navigate to="/login" replace={true} />;

  //and fincally we will return accesssible route

  return accessibleRoute;
};

export default ProtectedRoute;
