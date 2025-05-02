import React from 'react';

const NotificationCenter: React.FC = () => {
    const notifications = [
        { id: 1, message: 'Your room booking has been confirmed.', date: '2023-10-01' },
        { id: 2, message: 'New class schedule is available.', date: '2023-10-02' },
        { id: 3, message: 'Maintenance request has been completed.', date: '2023-10-03' },
    ];

    return (
        <div className="notification-center">
            <h2>Notifications</h2>
            <ul>
                {notifications.map(notification => (
                    <li key={notification.id}>
                        <p>{notification.message}</p>
                        <span>{notification.date}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationCenter;