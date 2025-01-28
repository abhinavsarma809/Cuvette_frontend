import React, { useState, useEffect } from "react";
import { createLink, getClicksData } from "../services"; // Import API methods
import StyleSheet from "./home.module.css";
import cuvette from "../../src/assets/cuvette.jpeg";
import { useNavigate, useLocation } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();
  
  const [userName, setUserName] = useState("");
  const [log ,setLog] = useState(false)
const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [link, setLink] = useState(false);
  const [formData, setFormData] = useState({
    originalUrl: "",
    remarks: "",
    expiryDate: "",
  });
  const [totalClicks, setTotalClicks] = useState(0);
  const [dateWiseClicks, setDateWiseClicks] = useState([]);
  const [deviceWiseClicks, setDeviceWiseClicks] = useState([]);

  useEffect(() => {
    const storeName = localStorage.getItem("userName");
    if (storeName) {
      setUserName(storeName);
    }

   
    fetchAnalytics();
  }, []); 
  
  const fetchAnalytics = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return; 

      const { total, dateWise, deviceWise } = await getClicksData(userId);
      console.log("Fetched Analytics Data:", { total, dateWise, deviceWise }); 

      // Update state with the fetched data
      if (total !== undefined) setTotalClicks(total);
      if (dateWise) setDateWiseClicks(dateWise);
      if (deviceWise) setDeviceWiseClicks(deviceWise);
    } catch (err) {
      console.error("Error fetching analytics data:", err.message);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    setUserName("");
    setIsLoggedIn(false);
    setLog(false); 
  };

  const handleLoginSignup = () => {
    navigate("/login"); 
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const LogoutFunction=()=>{
    setLog((prev)=>!(prev))
  }
  const handleSave = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await createLink({ ...formData, userId });
      setLink(false);
      setFormData({ originalUrl: "", remarks: "", expiryDate: "" });
      alert("Link saved successfully!");
      fetchAnalytics(); 
    } catch (err) {
      console.error(err.message);
      alert("Failed to save link.");
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
        <button className={StyleSheet.create} onClick={() => setLink(true)}>
          + Create new
        </button>
        <input type='search' placeholder="search by remarks" className={StyleSheet.remark}/>
        
        {!isLoggedIn && userName ? (
    <button className={StyleSheet.user} onClick={LogoutFunction}>
      {userName.slice(0, 2).toUpperCase()}
    </button>
  ) : (
    <button className={StyleSheet.loginSignup} onClick={handleLoginSignup}>
      Signup/Login
    </button>
  )}
  
      </div>
      
      {log &&
   <button className={StyleSheet.logout} onClick={handleLogout}>Logout</button>

  }      
  
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
            <button className={StyleSheet.clear} onClick={() => setLink(false)}>
              Clear
            </button>
            <button className={StyleSheet.save} onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      )}

       <div className={StyleSheet.secondRow}>
      <div className={StyleSheet.header1}>
      <div className={StyleSheet.imager}>
  
      </div>
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

     
      <div className={StyleSheet.analyticsSection}>
         <div className={StyleSheet.Rows}>
        <h2 className={StyleSheet.clicks}>Total Clicks: </h2>
        <p className={StyleSheet.clicks1}>{totalClicks}</p>
        </div>
        
   
        <div className={StyleSheet.analyticsGrid}>
          {/* Date-Wise Clicks */}
          <div className={StyleSheet.dateWise}>
            <h3 className={StyleSheet.DateWise}>Date-Wise Clicks</h3>
            {dateWiseClicks.map((click) => (
              <div key={click.date} className={StyleSheet.barRow}>
                <span>{click.date}</span>
                <div
                  className={StyleSheet.bar}
                  style={{ width: `${click.count * 2}px`, backgroundColor: "blue" }}
                ></div>
                <span>{click.count}</span>
              </div>
            ))}
          </div>

 
          <div className={StyleSheet.deviceWise}>
            <h3 className={StyleSheet.DateWise}>Device-Wise Clicks</h3>
            {deviceWiseClicks.map((device) => (
              <div key={device.device} className={StyleSheet.barRow}>
                <span>{device.device}</span>
                <div
                  className={StyleSheet.bar}
                  style={{ width: `${device.count * 2}px`, backgroundColor: "blue" }}
                ></div>
                <span>{device.count}</span>
              </div>
            ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
