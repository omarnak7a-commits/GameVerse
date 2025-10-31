import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('Registering...');

    try {
      const res = await axios.post('/api/auth/register', { email, password });
      setMessage('✅ Registration successful! Go to Login');
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.error || 'Registration failed'));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'rgba(26, 26, 46, 0.95)',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 0 30px rgba(0, 212, 255, 0.3)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        border: '1px solid #00d4ff'
      }}>
        <h1 style={{
          color: '#00d4ff',
          marginBottom: '30px',
          fontSize: '2.2rem',
          textShadow: '0 0 10px #00d4ff'
        }}>
          GameVerse
        </h1>
        <h2 style={{ color: '#fff', marginBottom: '20px' }}>Create Account</h2>

        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '15px',
              margin: '10px 0',
              borderRadius: '10px',
              border: '2px solid #444',
              background: '#2a2a3e',
              color: '#fff',
              fontSize: '1rem'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '15px',
              margin: '10px 0',
              borderRadius: '10px',
              border: '2px solid #444',
              background: '#2a2a3e',
              color: '#fff',
              fontSize: '1rem'
            }}
          />
          <button type="submit" style={{
            width: '100%',
            padding: '15px',
            margin: '20px 0',
            background: 'linear-gradient(45deg, #00d4ff, #00aaff)',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(0, 212, 255, 0.4)'
          }}>
            Register
          </button>
        </form>

        {message && (
          <p style={{
            marginTop: '15px',
            padding: '10px',
            background: message.includes('successful') ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)',
            borderRadius: '8px',
            color: '#fff'
          }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: '20px', color: '#aaa' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#00d4ff', textDecoration: 'none', fontWeight: 'bold' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}