import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useAppContext } from '../context/AppContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import roomDetailBackground from '../assets/roomImages/room-11.jpeg';
import img1 from '../assets/roomImages/details-2.jpeg';
import img2 from '../assets/roomImages/details-3.jpeg';
import img3 from '../assets/roomImages/details-4.jpeg';

function RoomDetailsPage() {
	const navigate = useNavigate();
	const { roomId } = useParams();
	// const { user, isLoggedIn} = useAppContext();
	const [user, setUser] = useState({});
	const [currentGuestId, setCurrentGuestId] = useState("");
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [roomDetails, setRoomDetails] = useState();
	const [selectedDate, setSelectedDate] = useState(new Date());
  	const [numberOfPeople, setNumberOfPeople] = useState(1);
	const defaultImg = [img1, img2, img3];
	const [newComment, setNewComment] = useState('');
  	const [isGuestAllowed, setIsGuestAllowed] = useState(false);
	const [roomReservation, setRoomReservation] = useState([]);
	const [comments, setComments] = useState({});
	const [bookingSuccessMess, setBookingSuccessMess] = useState(''); 

	const handleCommentChange = (event) => {
		setNewComment(event.target.value);
	};

	const submitComment = async () => {
		console.log('Submitting comment:', newComment);

		try {
			const response = await fetch(`${import.meta.env.VITE_API_GATEWAY_LINK}/add-comment`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ comment: newComment, roomId: roomId }),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			console.log('Received response:', data);
			setComments(data);
			setNewComment('');
		} catch (error) {
			console.error('Error submitting comment:', error);
		}
	};

	const handleDateChange = (date) => {
		setSelectedDate(date);
	};
	
	const handlePeopleChange = (e) => {
		const value = Math.min(e.target.value, roomDetails.capacity);
		setNumberOfPeople(value);
	};

	const handleSubmit = async () => {
		// const tempDate = subDays(selectedDate, 1);

		// console.log('User:', currentGuestId);
		const formattedDate = selectedDate.toISOString().split('T')[0];
		const data = {
			data :{
				groupId: Math.floor(Math.random() * 1000).toString()
			},
			room_id: roomDetails.room_id,
			date: formattedDate,
			people: numberOfPeople,
			guest_id: currentGuestId,
		};

		try {
			const response = await fetch(`${import.meta.env.VITE_API_GATEWAY_LINK}/room-reservation`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error('Something went wrong');
			}
			else {
				roomDetails.reservation_dates[formattedDate] = currentGuestId;
				const newRoomDetails = { ...roomDetails };
				setRoomDetails(newRoomDetails);

				const newRoomReservation = { ...roomDetails.reservation_dates };
				setRoomReservation(newRoomReservation);
				setBookingSuccessMess('Processing your booking... Shortly you will receive a confirmation email');
				setSelectedDate(new Date());
			}
		} catch (error) {
			console.error('Booking failed', error);
		}
	};

	function subDays(date, days) {
		const result = new Date(date);
		result.setDate(result.getDate() - days);
		return result;
	};
	
	function addDays(date, days) {
		const result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	};

	function generateExcludedDates(reservationDates) {
		const excludeDates = [];
		
		for (const dateStr in reservationDates) {
		  if (reservationDates.hasOwnProperty(dateStr)) {
			const date = addDays(dateStr, 1);
			// const date = new Date(dateStr);
			excludeDates.push(date);
		  }
		}
		
		return excludeDates;
	}

	const fetchRoomDetails = async () => {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_GATEWAY_LINK}/room-details`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ roomId })
			});
			const data = await response.json();
			setRoomDetails(data);
			setRoomReservation(data.reservation_dates || {});
			setComments(data.comments || {});
		} catch (error) {
			console.error('Error fetching room details:', error);
		}
	};

	useEffect(() => {
		const storedUser = localStorage.getItem('userEmail');
		const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Correctly parse the boolean value
		setUser(storedUser);
		setIsLoggedIn(storedIsLoggedIn); // Set the parsed boolean value
	}, [roomId]);

	useEffect(() => {
		setCurrentGuestId(user);
		fetchRoomDetails();
	}, [user, roomId]);

	useEffect(() => {
		if (Object.keys(roomReservation).length > 0) {
			const guestIds = Object.values(roomReservation).map(date => date.replace(/"/g, ''));
			setIsGuestAllowed(guestIds.includes(currentGuestId));
		}
	}, [currentGuestId, roomReservation]);

	useEffect(() => {
		console.log('room id  : ' + roomId)
		console.log(roomDetails)
	}, [])
	
  return (
	<>
		{roomDetails ? (
			<>
				<div className="inline-block text-white p-8 pb-12 text-center w-full" style={{ backgroundImage: `url(${roomDetailBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
					<div className="inline-block bg-gray-800 bg-opacity-50 text-white p-8 text-center capitalize w-2/4">
						<h1 className="text-4xl md:text-5xl lg:text-6xl">{roomDetails.room_name}</h1>
						<div className="w-40 h-1 bg-blue-500 mx-auto my-7"></div>
						<Link to="/" className="inline-block no-underline tracking-wide text-white font-bold bg-blue-500 py-2 px-3 border-3 border-white transition-all uppercase cursor-pointer hover:bg-white hover:text-blue-500">
							back to rooms
						</Link>
					</div>
				</div>

				<section className="pt-20">
					<div className="max-w-screen-lg mx-auto">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
							{defaultImg.map((item, index) => (
								<img key={index} src={item} className="w-full block" />
							))}
						</div>

						<div className="grid grid-cols-2 gap-96 mb-8">
							<article>
								<h3 className="text-2xl capitalize font-bold mb-3">details:</h3>
								<p className="text-gray-700 text-lg">{roomDetails.description}</p>
							</article>

							<article>
								<h3 className="text-2xl capitalize font-bold mb-3">information:</h3>
								<h6 className="text-gray-700 text-lg capitaliz mb-3">Location: {roomDetails.location}</h6>
								<h6 className="text-gray-700 text-lg capitalize mb-3">price : ${roomDetails.price}</h6>
								<h6 className="text-gray-700 text-lg capitalize mb-3">
								max capacity : {roomDetails.capacity > 1 ? `${roomDetails.capacity} people` : `${roomDetails.capacity} person`}
								</h6>
								<h6 className="text-gray-700 text-lg capitalize mb-3">free breakfast included</h6>
							</article>
						</div>
					</div>
				</section>
				<section className="mb-10">
					<div className="max-w-screen-lg mx-auto">
						<h3 className="text-2xl capitalize font-bold mb-3">Amenities:</h3>
						{roomDetails && Array.isArray(roomDetails.amenities) && (
							<ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{roomDetails.amenities.map((item, index) => (
									<li className="text-gray-700 text-lg capitalize" key={index}> - {item}</li>
								))}
							</ul>
						)}
						{/* <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{roomDetails.amenities.map((item, index) => (
							<li className="text-gray-700 text-lg capitalize" key={index}> - {item}</li>
						))}
						</ul> */}
					</div>
				</section>
				{isLoggedIn ? (
					<section className="mb-10">
						<div className="max-w-screen-lg mx-auto">
							<h3 className="text-2xl capitalize font-bold mb-3">Book Your Stay</h3>
							<div className="mb-4">
								<label htmlFor="datePicker" className="block mb-2">Select Date:</label>
								<DatePicker 
								showIcon
								minDate={new Date()} 
								selected={selectedDate}  
								onChange={handleDateChange} 
								isClearable
								placeholderText="   Select a date"
								shouldCloseOnSelect={false}
								dateFormat="yyyy-MM-dd"
								excludeDates={generateExcludedDates(roomDetails.reservation_dates)}
								className="border-2 rounded border-gray-800"
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="peopleInput" className="block mb-2">Number of People:</label>
								<input
								type="number"
								id="peopleInput"
								value={numberOfPeople}
								onChange={handlePeopleChange}
								min="1"
								max={roomDetails.capacity}
								className="border-2 rounded border-gray-800"
								/>
							</div>
							<button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
							<p className={`${bookingSuccessMess ? 'text-green-600 bg-green-100 border border-green-600 p-4 rounded-md mt-4' : ''}`}>
								{bookingSuccessMess}
							</p>
						</div>
					</section>
					
				) : (
					<section className="mb-10">
						<div className="max-w-screen-lg mx-auto">
							<p className="mb-4 font-bold">Login to book a room and check availability.</p>
							<button onClick={() => navigate('/login')} className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
						</div>
					</section>
				)}
				<section className="mb-10">
					<div className="max-w-screen-lg mx-auto">
					<h3 className="text-2xl capitalize font-bold mb-3">Comments</h3>
						<div>
							{Object.entries(comments).map(([id, [comment, polarity]]) => (
							<div key={id} className="border p-4 rounded-lg mb-4">
								<p>{comment}</p>
								<span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
								polarity === 'positive' ? 'bg-green-200 text-green-800' :
								polarity === 'negative' ? 'bg-red-200 text-red-800' :
								'bg-gray-200 text-gray-800'
								}`}>
								{polarity.charAt(0).toUpperCase() + polarity.slice(1)}
								</span>
							</div>
							))}
						</div>
						{isGuestAllowed && (
							<div className="mt-4">
							<input
								type="text"
								value={newComment}
								onChange={handleCommentChange}
								placeholder="Add your comment"
								className="border-2 border-gray-300 p-2 rounded-lg w-full"
							/>
							<button
								onClick={submitComment}
								className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
							>
								Submit Comment
							</button>
							</div>
						)}
					</div>	
				</section>
			</>
		
		) : (
			<p>Loading room details...</p>
		)}
  	</>
    
  )
}

export default RoomDetailsPage
