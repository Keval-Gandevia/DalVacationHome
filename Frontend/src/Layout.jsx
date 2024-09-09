import React, { useState, useEffect } from 'react';
import Navbar from "./components/NavBar";
import MyChatBot from './components/MyChatBot';
import CustomerChatBot from './components/CustomerChatBot';
import PropertyAgentChatBot from './components/PropertyAgentChatBot';
import { useAppContext } from "./context/AppContext";

const Layout = ({ children }) => {
  
  const [userRole, setUserRole] = useState(null);
  const { user, isLoggedIn } = useAppContext();

  useEffect(() => {
    if(user != null)
    {
      setUserRole(user["role"]);
    }
  }, [user]);

  return (
    <>
      <Navbar />
      {children}
      {isLoggedIn && userRole && userRole === 'customer' && <CustomerChatBot />}
      {isLoggedIn && userRole && userRole === 'property-agent' && <PropertyAgentChatBot />}
      {!isLoggedIn && <MyChatBot />}
    </>
  );
};

export default Layout;