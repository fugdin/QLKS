import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CustomerManagement from './pages/CustomerManagement';
import RoomManagement from './pages/RoomManagement';
import RoomTypeManagement from './pages/RoomTypeManagement';
import BookingManagement from './pages/BookingManagement';
import BillManagement from './pages/BillManagement';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import EmployeeManagement from './pages/EmployeeManagement';
import AccountManagement from './pages/AccountManagement';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<CustomerManagement />} />
            <Route path="rooms" element={<RoomManagement />} />
            <Route path="room-types" element={<RoomTypeManagement />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="bills" element={<BillManagement />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="accounts" element={<AccountManagement />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App; 