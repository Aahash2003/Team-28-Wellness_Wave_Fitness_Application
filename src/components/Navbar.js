import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Stack } from '@mui/material';

import Logo from '../Assets/Logo/Logo3.png';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate(); // Initialize the navigate function
  const location = useLocation(); // Get the current location

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isVerified");
    localStorage.removeItem("isAdmin");
    setIsAuthenticated(false);  // Update authentication state
    window.location.href = "https://habits-development.netlify.app"; // Redirect to the base page
  };

  const isActive = (path) => location.pathname === path; // Check if the path is active

  return (
    <Stack
      direction="row"
      justifyContent="space-around"
      sx={{ gap: { sm: '122px', xs: '40px' }, mt: { sm: '32px', xs: '20px' }, justifyContent: 'none' }}
      px="20px"
    >
      <Link to="/">
        <img src={Logo} alt="logo" style={{ width: '48px', height: '48px', margin: '10px' }} />
      </Link>
      <Stack alignItems="center" direction="row" gap="40px" fontSize="24px">
        {[
          { path: "/home", label: "Home" },
          { path: "/calc", label: "Caloric Calculator" },
          { path: "/workout", label: "Workout Log" },
          { path: "/Calories", label: "Caloric Counter" },
          { path: "/profile", label: "Profile" },
          { path: "/AI", label: "AI" },
          { path: "/FitBit", label: "FitBit"},
        ].map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              textDecoration: 'none',
              color: '#3A1212',
              margin: '0px',
              borderBottom: isActive(link.path) ? '3px solid #3A1212' : 'none', // Underline for active link
            }}
          >
            {link.label}
          </Link>
        ))}
        {isAuthenticated ? (
          <button
            style={{
              border: 'none',
              outline: 'none',
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '20px',
              width: '120px',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              marginRight: '20px',
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            style={{
              textDecoration: 'none',
              color: '#3A1212',
              border: 'none',
              outline: 'none',
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '20px',
              width: '120px',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              marginRight: '20px',
              textAlign: 'center',
            }}
          >
            Login
          </Link>
        )}
      </Stack>
    </Stack>
  );
};

export default Navbar;
