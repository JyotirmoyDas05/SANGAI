import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './CMS.css';

export default function CMSLayout() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [creds, setCreds] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        // Check session storage on load
        const storedAuth = sessionStorage.getItem('cms_auth');
        if (storedAuth) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        // Create Basic Auth string
        const authString = btoa(`${creds.username}:${creds.password}`);

        // Test credentials against API (simple verify)
        // For now, we'll just store and let the API reject if wrong
        // In production, you'd hit a /api/cms/verify endpoint

        sessionStorage.setItem('cms_auth', `Basic ${authString}`);
        setIsAuthenticated(true);
    };

    if (!isAuthenticated) {
        return (
            <div className="cms-login-container">
                <div className="cms-login-box">
                    <h2>Developer CMS</h2>
                    <p>Enter credentials to access</p>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={creds.username}
                                onChange={e => setCreds({ ...creds, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={creds.password}
                                onChange={e => setCreds({ ...creds, password: e.target.value })}
                                required
                            />
                        </div>
                        {error && <p className="error">{error}</p>}
                        <button type="submit">Access CMS</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="cms-layout">
            <header className="cms-header">
                <div className="cms-logo">SANGAI CMS</div>
                <button onClick={() => {
                    sessionStorage.removeItem('cms_auth');
                    setIsAuthenticated(false);
                }}>Logout</button>
            </header>
            <main className="cms-content">
                <Outlet />
            </main>
        </div>
    );
}
