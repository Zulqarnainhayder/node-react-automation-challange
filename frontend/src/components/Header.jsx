import { useAppContext } from '../context/AppContext';
import './Header.css';

const Header = () => {
  const { state, dispatch } = useAppContext();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">Item Manager</h1>
          <span className="welcome-text">Welcome, {state.user?.username}!</span>
        </div>
        
        <div className="header-right">
          <button onClick={handleLogout} className="logout-btn">
            <span className="logout-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
