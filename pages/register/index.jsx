import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services';  
import StyleSheet from './register.module.css';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  
    
    const [formError, setFormError] = useState({
      name: null,
      email: null,
      password: null,
     
    });
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      phone:'',
     
    });
    useEffect(() => {
    
  
    }, []);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      let errors = false;
  
      setFormError({
        name: null,
        email: null,
        password: null,
        phone: null,
      });
  
      
      if (!formData.name || formData.name.length < 1) {
        setFormError((prevFormError) => ({
          ...prevFormError,
          name: 'Name is required',
        }));
        errors = true;
      }
  
      if (!formData.email || formData.email.length < 1 || !formData.email.includes('@') || !formData.email.includes('.')) {
        setFormError((prevFormError) => ({
          ...prevFormError,
          email: 'Invalid Email',
        }));
        errors = true;
      }
  
     
  
  
      if (!formData.password) {
        setFormError((prevFormError) => ({
          ...prevFormError,
          password: 'Password is required',
        }));
        errors = true;
      }
      if (!formData.phone || formData.phone.length < 1 || !formData.phone.includes('@') || !formData.phone.includes('.')) {
        setFormError((prevFormError) => ({
          ...prevFormError,
          phone: 'Invalid number',
        }));
        errors = true;
      }
  
      if (errors) {
        return;
      }
  
      try {
        setLoading(true);
        const response = await register(formData); 

        if (response.token) {
        navigate('/', { state: { userName: response.name } }); 
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.id);
          localStorage.setItem('userName', response.name); 
          localStorage.setItem('email', response.email); 
          localStorage.setItem('phone', response.phone); 
            
        }
      } catch (error) {
        console.error("Error during registration:", error);

      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className={StyleSheet.MainContainer}>
 <img 
          src="https://res.cloudinary.com/dy6uubcd1/image/upload/v1737622494/Screenshot_23-1-2025_141923_www.figma.com_fvjas1.jpg" 
          className={StyleSheet.image1} 
          alt="Background"
      />
        <div className={StyleSheet.container}>
        
          
           <div className={StyleSheet.login}>
                  <p></p>
                  
                      <button className={StyleSheet.signup} onClick={()=>navigate('/register')}>
                          Signup
                      </button>
                      <button className={StyleSheet.loging} onClick={()=>navigate('/login')}>Login</button>
          
                 </div>
         
           
     
          <form onSubmit={handleSubmit} className={StyleSheet.form}>
            <h3>Join Us Today!</h3>
            <div className={StyleSheet.inputName}>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                className={StyleSheet.name}
              />
            </div>
            {formError.name && <p style={{ color: 'red' }} className={StyleSheet.errors}>{formError.name}</p>}
  
            <div className={StyleSheet.inputEmail}>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
                className={StyleSheet.email}
              />
            </div>
            {formError.email && <p style={{ color: 'red' }} className={StyleSheet.emailerrors}>{formError.email}</p>}
            <div className={StyleSheet.inputPhone}>
              <input
                type="password"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Mobile Number"
                className={StyleSheet.phone}
              />
            </div>
            {formError.phone && <p style={{ color: 'red' }} className={StyleSheet.phoneerrors}>{formError.phone}</p>}
            <div className={StyleSheet.inputPassword}>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
                className={StyleSheet.password}
              />
            </div>
            {formError.password && <p style={{ color: 'red' }} className={StyleSheet.passworderrors}>{formError.password}</p>}
            
            <div className={StyleSheet.inputPassword}>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Confirm Password"
                className={StyleSheet.password}
              />
            </div>
            {formError.password && <p style={{ color: 'red' }} className={StyleSheet.passworderrors}>{formError.password}</p>}
            
            <button disabled={loading} type="submit" className={StyleSheet.register}>
              {loading ? 'Loading... ' : 'Register'}
            </button>
            
            <p className={StyleSheet.log}>
              Already have an account? 
              <span className={StyleSheet.loginer} onClick={() => navigate('/login')}>Login</span>
            </p>
            <p></p>
            <p></p>
            
           
          </form>
         
        
      
       
        
     
      </div>
      </div>
    );
  };
  
  export default Register;
  