import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProtectedRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // to prevent setting state if the component is unmounted

    const verifyToken = async () => {
      const token = window.localStorage.getItem('token');

      if (!token) {
        if (isMounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await axios.get(
          'https://week-2-task-manager.onrender.com/api/v1/user/verify',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log(response.data);

        if (response.data.valid && isMounted) {
          setIsAuthenticated(true);
          setIsLoading(false);
          window.localStorage.setItem('token', response.data.token);
          navigate('/task'); // Redirect to /task after successful authentication
        } else {
          window.localStorage.removeItem('token');
          if (isMounted) setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        window.localStorage.removeItem('token');
        if (isMounted) setIsAuthenticated(false);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    verifyToken();

    return () => {
      isMounted = false; // cleanup to prevent state update on unmounted component
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          <p className="mt-4 text-slate-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoutes;
