import React, { useState, useEffect } from 'react';
import AddReview from './AddReview.js';

function Auth({ bookId }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch(`http://localhost:8000/checkIfUser/${username}`);
        const data = await response.json();

        if (data.length > 0) {
          // Username exists
          setUserExists(true);
        } else {
          // Username does not exist
          setUserExists(false);
        }
      } catch (err) {
        console.error('Error checking user:', err.message);
      }
    };

    if (username.trim() !== '') {
      checkUser();
    }
  }, [username]);

  const createUser = async () => {
    try {
      const response = await fetch('http://localhost:8000/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        console.log('User created successfully');
      } else {
        console.error('Error creating user:', response.statusText);
      }
    } catch (err) {
      console.error('Error creating user:', err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <label>Username:</label>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      {userExists ? (
        <AddReview bookId={bookId} />
      ) : (
        <div>
          <p>Create a new account:</p>
          <label>Create Password:</label>
          <input type="password" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={createUser}>Create Account</button>
        </div>
      )}
    </div>
  );
}

export default Auth;
