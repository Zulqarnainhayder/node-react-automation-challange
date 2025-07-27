import { useAppContext } from '../context/AppContext';
import Button from './UI/Button';
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
          <Button 
            onClick={handleLogout} 
            variant="outline"
            size="small"
            className="logout-btn"
          >
            <span className="logout-icon">🚪</span>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
