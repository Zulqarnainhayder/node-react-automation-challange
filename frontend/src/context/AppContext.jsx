import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

// Get initial state from localStorage
const getInitialState = () => {
  try {
    const savedAuth = localStorage.getItem('authState');
    if (savedAuth) {
      const { user, token, isAuthenticated } = JSON.parse(savedAuth);
      return {
        // Auth state from localStorage
        user,
        token,
        isAuthenticated,
        authLoading: false,
        authError: '',
        authSuccess: '',
        
        // Items state (always start fresh)
        items: [],
        itemsLoading: false,
        itemsError: '',
        itemMessage: '',
        editingItem: null,
      };
    }
  } catch (error) {
    console.error('Error loading auth state from localStorage:', error);
  }
  
  // Default initial state
  return {
    // Auth state
    user: null,
    token: '',
    isAuthenticated: false,
    authLoading: false,
    authError: '',
    authSuccess: '',
    
    // Items state
    items: [],
    itemsLoading: false,
    itemsError: '',
    itemMessage: '',
    editingItem: null,
  };
};

const initialState = getInitialState();

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_AUTH_LOADING':
      return { ...state, authLoading: action.payload, authError: '', authSuccess: '' };
    
    case 'LOGIN_SUCCESS':
      const loginState = {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        authLoading: false,
        authError: '',
        authSuccess: 'Login successful!'
      };
      // Save auth state to localStorage
      localStorage.setItem('authState', JSON.stringify({
        user: loginState.user,
        token: loginState.token,
        isAuthenticated: loginState.isAuthenticated
      }));
      return loginState;
    
    case 'LOGIN_ERROR':
      return {
        ...state,
        authLoading: false,
        authError: action.payload,
        authSuccess: ''
      };
    
    case 'LOGOUT':
      // Clear localStorage on logout
      localStorage.removeItem('authState');
      return {
        // Auth state (reset to default)
        user: null,
        token: '',
        isAuthenticated: false,
        authLoading: false,
        authError: '',
        authSuccess: '',
        
        // Items state (reset to default)
        items: [],
        itemsLoading: false,
        itemsError: '',
        itemMessage: '',
        editingItem: null,
      };
    
    case 'SET_ITEMS_LOADING':
      return { ...state, itemsLoading: action.payload, itemsError: '' };
    
    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload,
        itemsLoading: false,
        itemsError: ''
      };
    
    case 'SET_ITEMS_ERROR':
      return {
        ...state,
        itemsLoading: false,
        itemsError: action.payload
      };
    
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
        itemMessage: 'Item created successfully!'
      };
    
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.id ? action.payload : item
        ),
        editingItem: null,
        itemMessage: 'Item updated successfully!'
      };
    
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        itemMessage: 'Item deleted successfully!'
      };
    
    case 'SET_EDITING_ITEM':
      return { ...state, editingItem: action.payload };
    
    case 'SET_ITEM_MESSAGE':
      return { ...state, itemMessage: action.payload };
    
    case 'CLEAR_MESSAGES':
      return { ...state, authError: '', authSuccess: '', itemMessage: '' };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Debug: Log state changes and localStorage
  useEffect(() => {
    console.log('Auth state changed:', {
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      token: state.token ? 'present' : 'missing'
    });
    
    const savedAuth = localStorage.getItem('authState');
    console.log('localStorage authState:', savedAuth ? JSON.parse(savedAuth) : 'none');
  }, [state.isAuthenticated, state.user, state.token]);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
