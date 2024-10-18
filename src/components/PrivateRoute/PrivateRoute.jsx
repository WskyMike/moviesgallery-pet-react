/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="spinner-border text-primary m-5" role="status">
        <span className="visually-hidden">Загрузка...</span>
      </div>
    );
  }

  return user ? children : <Navigate to="/" />; 
};

export default PrivateRoute;
