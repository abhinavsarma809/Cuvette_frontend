import React, { useEffect, useState } from "react";
import { getLinks, deleteLink, updateLink, createLink } from "../services"; // Importing the API
import { FaCopy, FaEdit, FaTrash } from "react-icons/fa";
import cuvette from "../../src/assets/cuvette.jpeg";
import StyleSheet from "./link.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Links = () => {
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [linksPerPage] = useState(5);
  const [userName, setUserName] = useState("");
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [deleteLinkId, setDeleteLinkId] = useState(null);
  const [formData, setFormData] = useState({
    originalUrl: "",
    expiryDate: "",
    remarks: "",
  });
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false); // For the "Create new" button popup
  const [showLogout, setShowLogout] = useState(false); // State to control showing the logout button
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const storeName = localStorage.getItem("userName");
    if (storeName) {
      setUserName(storeName);
    }
    fetchLinks();
  }, []);

  const PopFunction = () => {
    setIsCreatePopupOpen((prev) => !prev);
  };

  const fetchLinks = async () => {
    try {
      const fetchedLinks = await getLinks(userId);
      setLinks(fetchedLinks);
    } catch (err) {
      console.error("Error fetching links:", err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/login"); 
  };

  const handlerChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteClick = (id) => {
    setDeleteLinkId(id);
    setIsDeletePopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteLink(deleteLinkId);
      setLinks(links.filter((link) => link._id !== deleteLinkId));
      setIsDeletePopupOpen(false);
    } catch (err) {
      console.error("Error deleting link:", err.message);
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
    } catch (err) {
      console.error(err.message);
      alert("Failed to save link.");
    }
  };

  const handleCancelDelete = () => {
    setDeleteLinkId(null);
    setIsDeletePopupOpen(false);
  };

  const handleEditClick = (link) => {
    setEditingLink(link);
    setFormData({
      originalUrl: link.originalUrl,
      expiryDate: link.expiryDate ? link.expiryDate.split("T")[0] : "",
      remarks: link.remarks,
    });
    setIsEditPopupOpen(true);
  };

  const handleEditSave = async () => {
    try {
      const updatedLink = await updateLink(editingLink._id, formData);
      setLinks(
        links.map((link) =>
          link._id === editingLink._id ? updatedLink : link
        )
      );
      setIsEditPopupOpen(false);
    } catch (err) {
      console.error("Error updating link:", err.message);
    }
  };

  const copyToClipboard = (shortLink) => {
    navigator.clipboard.writeText(shortLink);
    alert("Shortened link copied to clipboard!");
  };

  const handleShortLinkClick = async (shortUrl) => {
    try {
      await axios.post("/api/clicks", { shortUrl });
      navigate("/", { state: { refreshAnalytics: true } });
    } catch (err) {
      console.error("Error logging click:", err.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredLinks = links.filter((link) =>
    link.remarks.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = filteredLinks.slice(indexOfFirstLink, indexOfLastLink);

  const totalPages = Math.max(1, Math.ceil(filteredLinks.length / linksPerPage));

  return (
    <div className={StyleSheet.linkContainer}>
      <div className={StyleSheet.header}>
        <img src={cuvette} className={StyleSheet.cuvette} alt="Cuvette" />
        <div className={StyleSheet.userName}>
          <p>Good morning,</p>
          <p>{userName}</p>
        </div>
        <button className={StyleSheet.create} onClick={PopFunction}>
          + Create new
        </button>
        <input
          type="search"
          className={StyleSheet.remarks}
          placeholder="search for remarks"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className={StyleSheet.user} onClick={() => setShowLogout(!showLogout)}>
          {userName.slice(0, 2)}
        </button>
      </div>
      {showLogout && (
        <div className={StyleSheet.logout}>
          <button onClick={handleLogout} className={StyleSheet.logoutButton}>
            Logout
          </button>
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
                onChange={handlerChange}
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
                onChange={handlerChange}
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
                onChange={handlerChange}
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
          <button className={StyleSheet.DashBoard} onClick={() => navigate("/")}>
            DashBoard
          </button>
          <button className={StyleSheet.URL} onClick={() => navigate("/link")}>
            LINKS
          </button>
          <button className={StyleSheet.Analytics} onClick={() => navigate("/Analytics")}>
            Analytics
          </button>
          <button className={StyleSheet.Settings} onClick={() => navigate("/details")}>
            Settings
          </button>
        </div>

        {/* Links Table */}
        {currentLinks.length > 0 ? (
          <table className={StyleSheet.linksTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Original Link</th>
                <th>Shortened Link</th>
                <th>Remarks</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLinks.map((link) => {
                const isActive = new Date(link.expiryDate) > new Date();
                return (
                  <tr key={link._id}>
                    <td>{new Date(link.expiryDate).toLocaleDateString()}</td>
                    <td>{link.originalUrl}</td>
                    <td>
                      <a
                        href={link.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleShortLinkClick}
                      >
                        {link.shortUrl}
                      </a>
                    </td>
                    <td>{link.remarks}</td>
                    <td style={{ color: isActive ? "green" : "red", fontWeight: "bold" }}>
                      {isActive ? "Active" : "Inactive"}
                    </td>
                    <td>
                      <FaCopy title="Copy" onClick={() => copyToClipboard(link.shortUrl)} className={StyleSheet.icon} />
                      <FaEdit title="Edit" onClick={() => handleEditClick(link)} className={StyleSheet.icon} />
                      <FaTrash title="Delete" onClick={() => handleDeleteClick(link._id)} className={StyleSheet.icon} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No links available</p>
        )}
      </div>

   
      {isDeletePopupOpen && (
        <div className={StyleSheet.popupOverlay}>
          <div className={StyleSheet.popupBox}>
            <p>Are you sure you want to delete this link?</p>
            <div className={StyleSheet.popupActions}>
              <button onClick={handleConfirmDelete} className={StyleSheet.yesButton}>
                Yes
              </button>
              <button onClick={handleCancelDelete} className={StyleSheet.noButton}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

  
      {isEditPopupOpen && (
        <div className={StyleSheet.popupOverlay}>
          <div className={StyleSheet.popupBox}>
            <div className={StyleSheet.firstRow}>
              <p>Edit Link</p>
              <p onClick={() => setIsEditPopupOpen(false)}>X</p>
            </div>
            <div>
              <div className={StyleSheet.url}>
                <p>Original URL *</p>
                <input
                  type="text"
                  name="originalUrl"
                  placeholder="Add any URL"
                  value={formData.originalUrl}
                  onChange={handlerChange}
                  className={StyleSheet.urlField}
                />
              </div>
              <div className={StyleSheet.url}>
                <p>Expiry Date *</p>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handlerChange}
                  className={StyleSheet.urlField}
                />
              </div>
              <div className={StyleSheet.url}>
                <p>Remarks *</p>
                <input
                  type="text"
                  name="remarks"
                  placeholder="Remarks"
                  value={formData.remarks}
                  onChange={handlerChange}
                  className={StyleSheet.urlField}
                />
              </div>
              <button onClick={handleEditSave} className={StyleSheet.saveButton}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default Links;



