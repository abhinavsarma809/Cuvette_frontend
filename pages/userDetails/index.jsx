import React, { useState, useEffect } from 'react';
import { updateUserDetails } from '../services'; // Assuming updateUserDetails is your update service
import StyleSheet from "./user.module.css";
import { useNavigate } from 'react-router-dom';
import cuvette from "../../src/assets/cuvette.jpeg";
const UserDetails= () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('email');
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

      const updatedUser = await updateUserDetails(userId, { name: userName, email: email });

     
      localStorage.setItem('userName', updatedUser.name);
      localStorage.setItem('email', updatedUser.email);

      alert('Details updated successfully!');
    } catch (error) {
      console.error('Error updating user details:', error);
      alert('Failed to update details.');
    }
  };

  const handleDelete =()=>{
    localStorage.removeItem('userName');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    alert('User deleted successfully!');
    navigate('/register');
  }

  return (
    <div className={StyleSheet.container}>
      <div className={StyleSheet.header}>
              <img src={cuvette} className={StyleSheet.cuvette} alt="Cuvette" />
              <div className={StyleSheet.userName}>
                <p>Good morning,</p>
                <p>{userName}</p>
              </div>
              <button className={StyleSheet.create} >
                + Create new
              </button>
              <input type='search' placeholder="search by remarks" className={StyleSheet.remark}/>
              
           
          <button className={StyleSheet.user} >
            {userName.slice(0, 2).toUpperCase()}
          </button>
          </div>
       
    <div className={StyleSheet.secondRow}>
    <div className={StyleSheet.header1}>
            <button className={StyleSheet.DashBoard}>DashBoard</button>
            <button className={StyleSheet.URL} onClick={() => navigate("/link")}>
              LINKS
            </button>
            <button className={StyleSheet.Analytics} onClick={()=>navigate('/analytics')}>Analytics</button>
            <button
              className={StyleSheet.Settings}
              onClick={() => navigate("/details")}
            >
              Settings
            </button>
          </div>
     <div className={StyleSheet.UserName}>
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

      <button onClick={handleSave}  className={StyleSheet.Save}>Save Changes</button>
      <button onClick={handleDelete}  className={StyleSheet.Delete}>Delete</button>
    </div>
    </div>
    </div>
  );
};

export default UserDetails;
