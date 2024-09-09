import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';
import roomCardBackground from '../assets/roomImages/room-11.jpeg';
import { Link } from 'react-router-dom';

const RoomList = () => {
    const [rooms, setRooms] = useState([]);
    const [currentAgent, setCurrentAgent] = useState('');
    const context = useContext(AppProvider)
    const navigate = useNavigate()

    const fetchData = async () => {

        try {
            const response = await fetch(`${import.meta.env.VITE_API_GATEWAY_LINK}/room-availability`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            let data = await response.json();
            data = data.filter(element => element.agent_id === currentAgent)
            setRooms(data);
            
        } catch (error) {
            console.error('Error fetching room availability:', error);
        }
    };

    const onDelete = async (room_id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_LAMBDA_DELETE_ROOM_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'room_id': room_id })
            })
            
            fetchData()
            
            if (response.ok) {
                const {message} = await response.json();
                console.log(message)

            }
            
        } catch (error) {
            console.error("Error deleting room", error)
        }
    }

    const onUpdate = async (roomData) => {
        try {
            
            console.log(roomData)
            navigate(`/add-room`, { state: { roomData, agent_id: currentAgent } });

            
		} catch (error) {
			console.error('Error fetching room details:', error);
		}
    }

    useEffect(() => {
        const currentAgentID = localStorage.getItem('userEmail');
        setCurrentAgent(currentAgentID);
        fetchData();
    }, [rooms, currentAgent]);

    return (
        <div className="container mx-auto p-4 bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-center">Your Rooms</h1>
            <div className='flex flex-1 justify-center my-6'>
                <Link to={{ pathname: `/add-room` }} state={{agent_id: currentAgent}}>
                    <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                        <span>+ Add Room</span>
                    </button>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room, idx) => (
                    <div key={idx} className="bg-white border border-gray-300 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <Link key={room.room_id} to={`/room/${room.room_id}`}>
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
                            </div>
                        </Link>
                        <div className='flex flex-row justify-around mt-4'>
                            <button onClick={() => onUpdate(room)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                                Update
                            </button>
                            <button onClick={() => onDelete(room.room_id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default RoomList;
