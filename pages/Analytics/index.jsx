import React, { useEffect, useState } from "react";
import { getLinks, deleteLink ,createLink} from "../services"; 
import { useNavigate } from "react-router-dom";
import StyleSheet from "./analytics.module.css";  
import cuvette from "../../src/assets/cuvette.jpeg";

const Analytics = () => {
  const [links, setLinks] = useState([]);
  const [userName, setUserName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [linksPerPage] = useState(5);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    originalUrl: "",
    remarks: "",
    expiryDate: "",
  });
  useEffect(() => {
    const storeName = localStorage.getItem("userName");
    if (storeName) {
      setUserName(storeName);
    }
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const fetchedLinks = await getLinks(userId);
      console.log("Fetched Links:", fetchedLinks); // Check the structure of fetched data
      setLinks(fetchedLinks);
    } catch (err) {
      console.error("Error fetching links:", err.message);
    }
  };
  const fetchAnalytics = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return; 
  
        const { total, dateWise, deviceWise } = await getClicksData(userId);
        console.log("Fetched Analytics Data:", { total, dateWise, deviceWise }); // Log fetched data
  
        if (total !== undefined) setTotalClicks(total);
        if (dateWise) setDateWiseClicks(dateWise);
        if (deviceWise) setDeviceWiseClicks(deviceWise);
      } catch (err) {
        console.error("Error fetching analytics data:", err.message);
      }
    };

     const handleSave = async () => {
        try {
          const userId = localStorage.getItem("userId");
          const newLink = await createLink({ ...formData, userId });
          setIsCreatePopupOpen(false);
          setFormData({ originalUrl: "", remarks: "", expiryDate: "" });
          alert("Link added successfully!");
          
          setLinks((prevLinks) => [...prevLinks, newLink]);
      
          fetchAnalytics(); 
        } catch (err) {
          console.error(err.message);
          alert("Failed to save link.");
        }
      };
      
  const popFunction=()=>{
    setIsCreatePopupOpen((prev)=>!prev);
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
 

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/login"); 
  };


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };


  const filteredLinks = searchQuery
    ? links.filter(link =>
        link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.shortUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (link.remarks && link.remarks.toLowerCase().includes(searchQuery.toLowerCase())) // Check remarks if available
      )
    : links;

  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = filteredLinks.slice(indexOfFirstLink, indexOfLastLink);
  const totalPages = Math.max(1, Math.ceil(filteredLinks.length / linksPerPage));

  return (
    <div className={StyleSheet.container}>
      <div className={StyleSheet.header}>
        <img src={cuvette} className={StyleSheet.cuvette} alt="Cuvette" />
        <div className={StyleSheet.userName}>
          <p>Good morning,</p>
          <p>{userName}</p>
        </div>
        <button
          className={StyleSheet.create}
          onClick={popFunction}
        >
          + Create new
        </button>
        <input 
          type='search' 
          placeholder="Search for remarks" 
          className={StyleSheet.remarks} 
          value={searchQuery}
          onChange={handleSearchChange} 
        />
        
        <div className={StyleSheet.user} onClick={() => setShowLogout(!showLogout)}>
          {userName.slice(0, 2)}
        </div>
      </div>

      {showLogout && (
        <div className={StyleSheet.logoutDropdown}>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
      {isCreatePopupOpen && (
              <div className={StyleSheet.link}>
                <div className={StyleSheet.firstRow}>
                  <p>New Link</p>
                  <p onClick={() => setIsCreatePopupOpen(false)}>X</p>
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
                  <button className={StyleSheet.clear} onClick={() => setIsCreatePopupOpen(false)}>
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
          <button className={StyleSheet.DashBoard} onClick={()=>navigate('/')}>DashBoard</button>
          <button className={StyleSheet.URL} onClick={() => navigate('/link')}>LINKS</button>
          <button className={StyleSheet.Analytics} onClick={() => navigate('/Analytics')}>Analytics</button>
          <button className={StyleSheet.Settings} onClick={() => navigate('/details')}>Settings</button>
        </div>

        <table className={StyleSheet.analyticsTable}>
          <thead>
            <tr className={StyleSheet.Row}>
              <th>TimeStamp</th>
              <th>Original URL</th>
              <th>Shorten URL</th>
              <th>IP Address</th>
              <th>User Device</th>
            </tr>
          </thead>
          <tbody>
            {currentLinks.length === 0 ? (
              <tr>
                <td colSpan="5" className={StyleSheet.noData}>No links found</td>
              </tr>
            ) : (
              currentLinks.map((link) => (
                <tr key={link._id} className={StyleSheet.Table}>
                  <td>{new Date(link.createdAt).toLocaleString()}</td>
                  <td>{link.originalUrl}</td>
                  <td>
                    <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">
                      {link.shortUrl}
                    </a>
                  </td>
                  <td>{link.ipAddress}</td>
                  <td>{link.userDevice}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={StyleSheet.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? StyleSheet.activeButton : ""}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Analytics;
