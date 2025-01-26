import React, { useState,useEffect } from 'react';
import { createLink } from '../services';
import StyleSheet from './home.module.css';
import cuvette from "../../src/assets/cuvette.jpeg";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [link, setLink] = useState(false);
  const [formData, setFormData] = useState({
    originalUrl: '',
    remarks: '',
    expiryDate: '',
  });
  useEffect(()=>{
    const storeName = localStorage.getItem('userName');
    if(storeName){
        setUserName(storeName);
    }


  },[])


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSave = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Get userId from localStorage or auth context
      await createLink({ ...formData, userId });
      setLink(false); // Close the form after saving
      setFormData({ originalUrl: '', remarks: '', expiryDate: '' }); // Clear the form
      alert('Link saved successfully!');
    } catch (err) {
      console.error(err.message);
      alert('Failed to save link.');
    }
  };

  return (
    <div className={StyleSheet.container}>
      <div className={StyleSheet.header}>
      <img src={cuvette} className={StyleSheet.cuvette} alt="Cuvette" />

        <div className={StyleSheet.userName}>
          <p>Good morning,</p>
          <p>{userName}</p>
        </div>
        <button className={StyleSheet.create} onClick={() => setLink(true)}> + Create new</button>
      </div>

      {link && (
        <div className={StyleSheet.link}>
          <div className={StyleSheet.firstRow}>
            <p>New Link</p>
            <p onClick={() => setLink(false)}>X</p>
          </div>
          <div className={StyleSheet.secondUrl}>
            <div className={StyleSheet.url}>
              <p>Destination Url *</p>
              <input
                type="text"
                name="originalUrl"
                placeholder="Add any URL"
                value={formData.originalUrl}
                onChange={handleChange}
                className={StyleSheet.urlField}
              />
            </div>

            <div className={StyleSheet.url1}>
              <p>Remarks *</p>
              <input
                type="text"
                name="remarks"
                placeholder="Add remarks"
                value={formData.remarks}
                onChange={handleChange}
                className={StyleSheet.RemarksField}
              />
            </div>

            <div className={StyleSheet.date}>
              <div className={StyleSheet.expiration}>
                <p>Link Expiration</p>
              </div>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className={StyleSheet.dateField}
              />
            </div>
          </div>

          <div className={StyleSheet.lastOne}>
            <button className={StyleSheet.clear} onClick={() => setLink(false)}>Clear</button>
            <button className={StyleSheet.save} onClick={handleSave}>Save</button>
          </div>
        </div>
      )}
      <div className={StyleSheet.header1}>
      
        <button className={StyleSheet.DashBoard}>DashBoard</button>
        <button className={StyleSheet.URL} onClick={() => navigate('/link')}>LINKS</button>
        <button className={StyleSheet.Analytics}>Analytics</button>
        <button className={StyleSheet.Settings} onClick={() => navigate('/details')}>Settings</button>
        </div>
    </div>
  );
};

export default Home;
