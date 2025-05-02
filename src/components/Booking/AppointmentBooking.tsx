import React, { useState } from 'react';

const AppointmentBooking = () => {
    const [appointmentDetails, setAppointmentDetails] = useState({
        lecturer: '',
        date: '',
        time: '',
        notes: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAppointmentDetails({
            ...appointmentDetails,
            [name]: value
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Logic to handle appointment booking submission
        console.log('Appointment booked:', appointmentDetails);
    };

    return (
        <div>
            <h2>Book an Appointment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="lecturer">Lecturer:</label>
                    <input
                        type="text"
                        id="lecturer"
                        name="lecturer"
                        value={appointmentDetails.lecturer}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={appointmentDetails.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="time">Time:</label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={appointmentDetails.time}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="notes">Notes:</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={appointmentDetails.notes}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Book Appointment</button>
            </form>
        </div>
    );
};

export default AppointmentBooking;