import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  const { user, isLoggedIn, handleLogout } = useAppContext();

  useEffect(() => {
    if(user != null)
    {
      setUserRole(user["role"]);
    }
  }, [user]);

  
  const navigateToDashboard = () => {
    if (userRole === 'customer') {
      navigate('/');
    } else if (userRole === 'property-agent') {
      navigate('/property-agent-dashboard'); 
    }
  };

  const navigateToRooms = () => {
    if (!isLoggedIn) {
      navigate('/');
    } else if (userRole === 'property-agent') {
      navigate('/rooms');
    } else if (userRole === 'customer') {
      navigate('/');
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold" onClick={() => navigate('/')}>
        DAL VACATION
      </div>
      <div>
        <button className="mr-4" onClick={navigateToRooms}>Rooms</button>
        {isLoggedIn && (
          <button className="mr-4" onClick={navigateToDashboard}>
            {userRole === 'customer' ? 'Customer Dashboard' : userRole === 'property-agent' ? 'Property Agent Dashboard' : ''}
          </button>
        )}
        {isLoggedIn ? (
          <button onClick={() => {navigate("/"); handleLogout()}}>Logout</button>
        ) : (
          <>
            <button className="mr-4" onClick={() => {navigate('/login')}}>Login</button>
            <button className="mr-4" onClick={() => {navigate('/register')}}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;