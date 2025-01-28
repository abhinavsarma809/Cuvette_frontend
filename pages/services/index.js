const BACKEND_URL = "https://cuvette-backend-puce.vercel.app";
import axios from 'axios';

export const login =async(data)=>{
   const response = await fetch(`${BACKEND_URL}/api/user/signin`,{
    method : 'POST',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify(data),
   });
   if (response.status == 200 || response.status == 400){
    return response.json();
   }
   throw new Error('Something went wrong');
};


export const register = async (data) => {
    const response = await fetch(`${BACKEND_URL}/api/user/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  
    if (response.status === 200 || response.status === 400) {
      return response.json();
    }
    throw new Error('Something went wrong');
  };


export const createLink = async (data) => {
  const response = await fetch(`${BACKEND_URL}/api/link/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    return response.json();
  }
  throw new Error('Failed to create link');
};


export const getLinks = async (userId) => {
  const response = await fetch(`${BACKEND_URL}/api/link/links/${userId}`);

  if (response.ok) {
    return response.json();
  }
  throw new Error('Failed to fetch links');
};

export const deleteLink = async (id) => {
  const response = await fetch(`${BACKEND_URL}/api/link/delete/${id}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    return response.json();
  }
  throw new Error('Failed to delete link');
};
export const updateLink = async (id, data) => {
  const response = await fetch(`${BACKEND_URL}/api/link/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    return response.json();
  }
  throw new Error('Failed to update link');
};
export const updateUserDetails = async (id, data) => {
  const response = await fetch(`${BACKEND_URL}/api/user/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    return response.json();
  }
  throw new Error('Failed to update user details');
};

export const getDeviceWiseAnalytics = async (userId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/link/analytics/device/${userId}`);
    const deviceWise = response.data.flatMap((link) => {
      if (link.clicksByDevice) {
        return Object.entries(link.clicksByDevice).map(([device, count]) => ({
          device,
          count,
        }));
      }
      return [];
    });
    return deviceWise;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch device-wise analytics");
  }
};

export const getDateWiseAnalytics = async (userId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/link/analytics/date/${userId}`);
    const dateWise = response.data.flatMap((link) => {
      if (link.clicksByDate) {
        return Object.entries(link.clicksByDate).map(([date, count]) => ({
          date,
          count,
        }));
      }
      return [];
    });
    return dateWise;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch date-wise analytics");
  }
};

export const getClicksData = async (userId) => {
  try {
    const responseDate = await axios.get(`${BACKEND_URL}/api/link/analytics/date/${userId}`);
    const responseDevice = await axios.get(`${BACKEND_URL}/api/link/analytics/device/${userId}`);
    
    if (!Array.isArray(responseDate.data) || !Array.isArray(responseDevice.data)) {
      throw new Error("Invalid response format");
    }

    const total = responseDate.data.reduce((sum, link) => sum + Object.values(link.clicksByDate || {}).reduce((acc, count) => acc + count, 0), 0);

    const dateWise = responseDate.data.flatMap((link) => {
      if (link.clicksByDate) {
        return Object.entries(link.clicksByDate).map(([date, count]) => ({
          date,
          count,
        }));
      }
      return [];
    });

    const deviceWise = responseDevice.data.flatMap((link) => {
      if (link.clicksByDevice) {
        return Object.entries(link.clicksByDevice).map(([device, count]) => ({
          device,
          count,
        }));
      }
      return [];
    });

    return { total, dateWise, deviceWise };
  } catch (error) {
    console.error("Error fetching clicks data:", error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch clicks data");
  }
};



