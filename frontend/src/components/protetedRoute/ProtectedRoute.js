import React from 'react';
import { Navigate } from "react-router-dom";


const ProtectedRouteElement = ({ element: Component, ...props}) => {
  return (
    props.loggedIn ? Component : <Navigate to="/sign-in" replace/>)}

export default ProtectedRouteElement; 