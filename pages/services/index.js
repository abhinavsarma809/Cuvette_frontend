const BACKEND_URL = "http://localhost:5000";


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
