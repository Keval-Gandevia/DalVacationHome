import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RoomForm = () => {
    const { roomData, agent_id } = useLocation().state || {};
    const navigate = useNavigate(); // Use the useNavigate hook to programmatically navigate
    const initialRoomState = {
        room_name: roomData !== undefined ? roomData.room_name : '',
        room_type: roomData !== undefined ? roomData.room_type : '',
        capacity: roomData !== undefined ? roomData.capacity : '',
        price: roomData !== undefined ? roomData.price : '',
        location: roomData !== undefined ? roomData.location : '',
        amenities: roomData !== undefined && roomData.amenities !== undefined ? roomData.amenities.join(', ') : '', // Join array to string for input field
        description: roomData !== undefined ? roomData.description : '',
        comments: [],
        reservation_dates: {},
        agent_id
    }
    const [room, setRoom] = useState(initialRoomState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoom({
            ...room,
            [name]: value,
        });
    };

    const handleAmenitiesChange = (e) => {
        setRoom({
            ...room,
            amenities: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let updatedRoom = room
        if (roomData !== undefined) {
            updatedRoom = {...updatedRoom, room_id: roomData.room_id}
        }

        // Split amenities by comma and trim whitespace
        const amenitiesArray = room.amenities.split(',').map(a => a.trim());

        updatedRoom = {...updatedRoom, amenities: amenitiesArray}

        
        try {
            console.log(updatedRoom);
            navigate('/rooms'); // Navigate back to the /rooms page after a successful addition/update

            const response = await fetch(`${import.meta.env.VITE_LAMBDA_ADD_UPDATE_ROOM_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedRoom),
            });

            if (response.ok) {
                console.log('room added / updated');
            }

            setRoom(initialRoomState);
        } catch (error) {
            console.error('Error adding/updating', error);
        }

    };

    useEffect(() => {
        console.log('batman')
        console.log(roomData);

    }, []);

    return (
        <form onSubmit={handleSubmit} className="room-form">
            <h2 className="text-xl font-semibold mb-4">{room.room_id ? 'Update Room' : 'Add Room'}</h2>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Room Name</label>
                <input
                    type="text"
                    name="room_name"
                    value={room.room_name}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 w-full rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Room Type</label>
                <input
                    type="text"
                    name="room_type"
                    value={room.room_type}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 w-full rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Capacity</label>
                <input
                    type="number"
                    name="capacity"
                    value={room.capacity}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 w-full rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Price</label>
                <input
                    type="number"
                    name="price"
                    value={room.price}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 w-full rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Location</label>
                <input
                    type="text"
                    name="location"
                    value={room.location}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 w-full rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Amenities (comma separated)</label>
                <input
                    type="text"
                    name="amenities"
                    value={room.amenities}
                    onChange={handleAmenitiesChange}
                    className="border border-gray-300 p-2 w-full rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                    name="description"
                    value={room.description}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 w-full rounded"
                    required
                />
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                {roomData ? 'Update Room' : 'Add Room'}
            </button>
        </form>
    );
};

export default RoomForm;
