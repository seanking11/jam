import React, { useState, useEffect } from 'react';

import { SignIn, SignUp } from './index'

// Get an extension that allows you to write arrow functions, normal functions, objects, etc.

const LoginScreen = ({ setUser }) => {
  const [showSignIn, setShowSignIn] = useState(false)
  
  const toggleShowSignIn = () => {
    console.log('toggle')
    setShowSignIn(!showSignIn)
  }

  return (
    <div className="App">
      {showSignIn ? 
        <SignIn
          toggleVisibility={toggleShowSignIn}
          setUser={setUser}
        /> 
          : 
        <SignUp
          toggleVisibility={toggleShowSignIn}
        />}
    </div>
  );
}

export default LoginScreen;
