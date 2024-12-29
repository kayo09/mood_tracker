import React, { useState } from 'react';
import axios from 'axios'
import '../styles/RegisterPage.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try{
            const response = await axios.post('http://localhost:8000/register/', {
                "username": username,
                "email": email,
                'password': password,
            });
            const { user } = response.data;
            alert(`Welcome, ${user.name || user.email}!`);
            console.log('User:', user);

            setLoading(false);
        }
        catch(err){
            setLoading(false);

            if(err.response){
                if(err.response.data && err.response.data.detail){
                    setError(err.response.data.detail);
                } else {
                    setError('An error occurred, please try again.');
                }
            } else {
                setError('Network error, please check your connection.');
                console.error('Error:', err);
            }
        }
    }

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Register'}</button>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
}

export default RegisterPage;