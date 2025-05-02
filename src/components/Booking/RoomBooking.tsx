import React, { useState, useEffect } from 'react';

const RoomBooking = () => {
    const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch available rooms from the API
        const fetchRooms = async () => {
            try {
                const response = await fetch('/api/rooms'); // Adjust the API endpoint as necessary
                const data = await response.json();
                setRooms(data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
    }, []);

    const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedRoom || !bookingDate || !bookingTime) {
            setMessage('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('/api/bookRoom', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ room: selectedRoom, date: bookingDate, time: bookingTime }),
            });

            if (response.ok) {
                setMessage('Room booked successfully!');
                // Optionally reset the form
                setSelectedRoom('');
                setBookingDate('');
                setBookingTime('');
            } else {
                setMessage('Failed to book room. Please try again.');
            }
        } catch (error) {
            console.error('Error booking room:', error);
            setMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div>
            <h2>Room Booking</h2>
            <form onSubmit={handleBooking}>
                <div>
                    <label htmlFor="room">Select Room:</label>
                    <select id="room" value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                        <option value="">--Select a room--</option>
                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>{room.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="date">Booking Date:</label>
                    <input type="date" id="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="time">Booking Time:</label>
                    <input type="time" id="time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} required />
                </div>
                <button type="submit">Book Room</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RoomBooking;