import React, { useEffect, useState } from "react";
import { getLinks, deleteLink } from "../services"; // Adjust API method as necessary
import { FaTrash } from "react-icons/fa";
import StyleSheet from "./analytics.module.css";  
import cuvette from "../../src/assets/cuvette.jpeg";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const [links, setLinks] = useState([]);
  const [userName, setUserName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [linksPerPage] = useState(5);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

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
      setLinks(fetchedLinks);
    } catch (err) {
      console.error("Error fetching links:", err.message);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteLink(id); // Make sure this function is defined in your services
      fetchLinks(); // Re-fetch the links after deletion
    } catch (err) {
      console.error("Error deleting link:", err);
    }
  };

  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = links.slice(indexOfFirstLink, indexOfLastLink);
  const totalPages = Math.max(1, Math.ceil(links.length / linksPerPage));

  return (
    <div className={StyleSheet.container}>
      {/* Header Section */}
      <div className={StyleSheet.header}>
        <img src={cuvette} className={StyleSheet.cuvette} alt="Cuvette" />
        <div className={StyleSheet.userName}>
          <p>Good morning,</p>
          <p>{userName}</p>
        </div>
        <button
          className={StyleSheet.create}
          onClick={() => setIsCreatePopupOpen(true)}
        >
          + Create new
        </button>
      </div>

      <div className={StyleSheet.secondRow}>
        <div className={StyleSheet.header1}>
          <button className={StyleSheet.DashBoard}>DashBoard</button>
          <button className={StyleSheet.URL} onClick={() => navigate('/link')}>LINKS</button>
          <button className={StyleSheet.Analytics} onClick={() => navigate('/Analytics')}>Analytics</button>
          <button className={StyleSheet.Settings} onClick={() => navigate('/details')}>Settings</button>
        </div>
   

   
      {/* Table Section */}
      <table className={StyleSheet.analyticsTable}>
        <thead>
            
          <tr className={StyleSheet.Row}>
            <th>TimeStamp</th>
            <th>Original URL</th>
            <th>Shortern URL</th>
            <th>IP Address</th>
            <th>User Device</th>
       
          </tr>
        </thead>
        <tbody >

          {currentLinks.map((link) => (
                 
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
         
          ))}
      
        </tbody>
      </table>

      
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
    </div>
  );
};

export default Analytics;
