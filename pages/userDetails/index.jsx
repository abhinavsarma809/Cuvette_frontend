import React, { useState, useEffect } from 'react';
import { updateUserDetails } from '../services'; // Assuming updateUserDetails is your update service

const UserDetails= () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('userEmail');
    const storedUserId = localStorage.getItem('userId');
    
    if (storedName) {
      setUserName(storedName);
    }
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleSave = async () => {
    try {
      // Update the user details in the database
      const updatedUser = await updateUserDetails(userId, { name: userName, email: userEmail });

      // Update the localStorage with the new values
      localStorage.setItem('userName', updatedUser.name);
      localStorage.setItem('userEmail', updatedUser.email);

      alert('Details updated successfully!');
    } catch (error) {
      console.error('Error updating user details:', error);
      alert('Failed to update details.');
    }
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div>
        <label>Name</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>

      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default UserDetails;
