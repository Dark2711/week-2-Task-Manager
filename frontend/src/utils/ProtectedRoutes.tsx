import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
  const user = true;

  return user ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoutes;
