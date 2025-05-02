import React from 'react';

const TimetableViewer: React.FC = () => {
    // Sample timetable data
    const timetableData = [
        { day: 'Monday', time: '9:00 AM - 10:00 AM', subject: 'Mathematics', lecturer: 'Dr. Smith' },
        { day: 'Monday', time: '10:00 AM - 11:00 AM', subject: 'Physics', lecturer: 'Dr. Johnson' },
        { day: 'Tuesday', time: '9:00 AM - 10:00 AM', subject: 'Chemistry', lecturer: 'Dr. Lee' },
        { day: 'Wednesday', time: '11:00 AM - 12:00 PM', subject: 'Biology', lecturer: 'Dr. Brown' },
        { day: 'Thursday', time: '1:00 PM - 2:00 PM', subject: 'History', lecturer: 'Dr. Wilson' },
        { day: 'Friday', time: '2:00 PM - 3:00 PM', subject: 'Computer Science', lecturer: 'Dr. Taylor' },
    ];

    return (
        <div>
            <h2>Timetable Viewer</h2>
            <table>
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Time</th>
                        <th>Subject</th>
                        <th>Lecturer</th>
                    </tr>
                </thead>
                <tbody>
                    {timetableData.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.day}</td>
                            <td>{entry.time}</td>
                            <td>{entry.subject}</td>
                            <td>{entry.lecturer}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TimetableViewer;