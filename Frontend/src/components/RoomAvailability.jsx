import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';
import roomCardBackground from '../assets/roomImages/room-11.jpeg'; 

const RoomAvailability = () => {
  const [rooms, setRooms] = useState([]);
  const context = useContext(AppProvider)

  // const fetchData = async () => {
  //   try {
  //     const response = await fetch(`${import.meta.env.VITE_API_GATEWAY_LINK}/room-availability`);
  //     if (response.ok) {
  //       const data = await response.json();
  //       setRooms(data);
  //     } else {
  //       throw new Error('Failed to fetch rooms');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching room availability:', error);
  //   }
  // };

  const fetchData = async () => {
    console.log("context\n")
    console.log(context)

    try {
      // if user is agent 
      //      fetch only agent rooms
      // else
      const response = await fetch(`${import.meta.env.VITE_API_GATEWAY_LINK}/room-availability`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({}),
      });
      // if - end

      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      } else {
        throw new Error('Failed to fetch rooms');
      }
    } catch (error) {
      console.error('Error fetching room availability:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Rooms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Link key={room.room_id} to={`/room/${room.room_id}`}>
            <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative overflow-hidden rounded-lg h-40">
                <img src={roomCardBackground} alt={room.room_name} className="absolute inset-0 object-cover w-full h-full" />
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                  <h2 className="text-2xl font-semibold mb-2 text-white">{room.room_name}</h2>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-700">Type: {room.room_type}</p>
                <p className="text-gray-700">Capacity: {room.capacity}</p>
                <p className="text-gray-700">Price: ${room.price} per night</p>
                <p className="text-gray-700">Location: {room.location}</p>
                <p className="text-blue-600 mt-4">View Details</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RoomAvailability;
