import { useLocation, useNavigate } from 'react-router-dom';
import sangaiLogo from '../../assets/Sangai logo.png';
import './Navbar.css';

/**
 * Global Navigation Bar
 * Dark forest green theme with bright green accents
 * 
 * Behavior:
 * - /explore: Only search bar in center (no nav links)
 * - /search: No search bar at all (search is on the page)
 * - Other pages: Nav links + search button
 */
export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const isExplorePage = location.pathname === '/explore';
    const isSearchPage = location.pathname === '/search';

    // Check if user is on a region page (not intro, explore, search, or destination)
    const knownPaths = ['/', '/explore', '/search', '/northeast'];
    const isRegionPage = !knownPaths.includes(location.pathname) &&
        !location.pathname.startsWith('/destination/') &&
        !location.pathname.startsWith('/northeast/');

    const handleSearchClick = () => {
        navigate('/search');
    };

    const handleLogoClick = () => {
        // User wants logo to always act as "Back to Map"
        // Since Navbar is hidden on Intro page, this always goes to /explore
        navigate('/explore');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Left Section: Logo + Search (on Explore page) */}
                <div className="navbar-left">
                    <button className="navbar-logo" onClick={handleLogoClick}>
                        <img src={sangaiLogo} alt="SANGAI" className="logo-image" />
                        <span className="logo-text">SANGAI</span>
                    </button>

                    {isExplorePage && (
                        /* Explore page: Search bar next to logo */
                        <div className="center-search-bar" onClick={handleSearchClick}>
                            <span className="search-icon">🔍</span>
                            <span className="search-placeholder">Search states, stories, or landmarks...</span>
                        </div>
                    )}
                </div>



                {/* Right Section: Login button (no search on explore or search pages) */}
                <div className="navbar-right">
                    {!isExplorePage && !isSearchPage && (
                        <button className="search-button" onClick={handleSearchClick}>
                            <span className="search-icon">🔍</span>
                        </button>
                    )}
                    <button className="login-button">Log In</button>
                </div>
            </div>
        </nav>
    );
}
