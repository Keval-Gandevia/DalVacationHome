import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css';
import { RoomDetailsPage, Login, Registration, CustomerDashboard, PropertyAgentDashboard } from './pages';
import RoomAvailability from './components/RoomAvailability';
import Layout from "./Layout"; 
import RoomForm from './components/RoomForm'; 
import RoomList from './components/RoomList'; 
import { AppProvider, useAppContext } from "./context/AppContext";

function App() {
  

  const router = createBrowserRouter([
    { path: "/", element: <Layout><RoomAvailability /></Layout> },
    { path: "/room/:roomId", element: <Layout><RoomDetailsPage /></Layout> },
    { path: "/login", element: <Layout><Login /></Layout> },
    { path: "/register", element: <Layout><Registration /></Layout> },
    { path: "/customer-dashboard", element: <Layout><CustomerDashboard /></Layout> },
    { path: "/property-agent-dashboard", element: <Layout><PropertyAgentDashboard /></Layout> },
    { path: "/add-room", element: <Layout><RoomForm /></Layout> }, 
    { path: "/rooms", element: <Layout><RoomList /></Layout> }, 
  ]);



  return (
    <>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </>
  );
}

export default App;
