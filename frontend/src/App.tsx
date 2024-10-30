import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Task from './pages/Task';
import ProtectedRoutes from './utils/ProtectedRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        {/* Redirect to /signin by default */}
        <Route path="/" element={<Navigate to="/signin" replace />} />

        {/* Protected route for authenticated users */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/task" element={<Task />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
