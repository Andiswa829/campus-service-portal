import React, { useState } from 'react';

const IssueReporting: React.FC = () => {
    const [issueDescription, setIssueDescription] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Here you would typically send the issue to your backend API
            // await api.reportIssue({ description: issueDescription, contact: contactInfo });
            setSuccessMessage('Issue reported successfully!');
            setIssueDescription('');
            setContactInfo('');
        } catch (error) {
            setErrorMessage('Failed to report the issue. Please try again.');
        }
    };

    return (
        <div>
            <h2>Report an Issue</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="issueDescription">Issue Description:</label>
                    <textarea
                        id="issueDescription"
                        value={issueDescription}
                        onChange={(e) => setIssueDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="contactInfo">Your Contact Information:</label>
                    <input
                        type="text"
                        id="contactInfo"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {successMessage && <p>{successMessage}</p>}
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export default IssueReporting;