import React, { useContext, useState } from 'react'
import { authStyles as styles } from '../assets/dummystyle'
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../utils/helper';
import { API_PATHS } from '../utils/apiPaths';
import axiosInstance from '../utils/axiosInstance';
import { UserContext } from '../context/UserContext';
import { Input } from './Input.jsx';
import Login from './Login.jsx';
import LandingPage from '../pages/LandingPage.jsx';


const SignUp = ({setCurrentPage}) => {
    const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
   if(!fullName ) {
     setError('Please Enter your full name');
     return;
   }
   if(!validateEmail(email)) {
     setError('Please Enter a valid email');
     return;
   }
   if(!password) {
     setError('Please Enter a password');
     return;
   }
   if (password.length < 8) {
  setError('Password must be at least 8 characters long');
  return;
}

   setError(null);

   try{
    const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER ,  {
        name: fullName,
        email,
        password,
    });

    const { token } = response.data;

   if(token) {
       localStorage.setItem('token', token);
       updateUser(response.data);
       navigate('/dashboard');
   }
}
   catch (error) {
       setError(error.response?.data?.message || 'An error occurred during sign up');
   }
  }

  return (
   <div className={styles.signupContainer}>
    <div className={styles.headerWrapper}>
        <h3 className={styles.signupTitle}>Create Account</h3>
        <p className={styles.signupSubtitle}>Join us to build your resume</p>
    </div>

    {/* form */}

    <form onSubmit={handleSignUp} className={styles.signupForm}>
        <Input value={fullName} onChange={({target}) => setFullName(target.value)} 
        placeholder="Full Name"
        label="Full Name"
        type="text"
        />

        <Input value={email} onChange={({target}) => setEmail(target.value)} 
        placeholder="Email"
        label="Email"
        type="email"
        />

        <Input value={password} onChange={({target}) => setPassword(target.value)} 
        placeholder="min 8 characters"
        label="Password"
        type="password"
        />
        {error && <div className={styles.errorMessage}>{error}</div>}

        <button type="submit" className={styles.signupSubmit}>
            Sign Up
            </button>

            {/* footer */}
            <p className={styles.switchText}>
                Already have an account? <button onClick={() => {
                  if (typeof setCurrentPage === 'function') {
                    setCurrentPage('Login');
                  } else {
                    navigate('/login');
                  }
                }} type="button" className={styles.signupSwitchButton}>Sign In</button>
            </p>
    </form>
   </div>
  )
}

export default SignUp
