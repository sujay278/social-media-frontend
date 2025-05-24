// AuthPage.js
import React, { useState } from 'react';
import Login from './Login';
import SingUp from './SignUp';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? (
        <>
          <Login />
          <p style={{ textAlign: 'center' }}>
            Don't have an account?{' '}
            <span
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={() => setIsLogin(false)}
            >
              Sign up
            </span>
          </p>
        </>
      ) : (
        <>
          <SingUp />
          <p style={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <span
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={() => setIsLogin(true)}
            >
              Login
            </span>
          </p>
        </>
      )}
    </div>
  );
}

export default AuthPage;
