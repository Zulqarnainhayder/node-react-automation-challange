import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import ItemList from './ItemList';
import ItemForm from './ItemForm';
import Header from './Header';
import apiService from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    dispatch({ type: 'SET_ITEMS_LOADING', payload: true });
    try {
      const items = await apiService.getItems();
      dispatch({ type: 'SET_ITEMS', payload: items });
    } catch (error) {
      dispatch({ type: 'SET_ITEMS_ERROR', payload: error.message });
    }
  };

  const handleCreateItem = async (itemData) => {
    try {
      const newItem = await apiService.createItem(itemData);
      dispatch({ type: 'ADD_ITEM', payload: newItem });
      setTimeout(() => dispatch({ type: 'CLEAR_MESSAGES' }), 3000);
    } catch (error) {
      dispatch({ type: 'SET_ITEM_MESSAGE', payload: error.message });
    }
  };

  const handleUpdateItem = async (id, itemData) => {
    try {
      const updatedItem = await apiService.updateItem(id, itemData);
      dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
      setTimeout(() => dispatch({ type: 'CLEAR_MESSAGES' }), 3000);
    } catch (error) {
      dispatch({ type: 'SET_ITEM_MESSAGE', payload: error.message });
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await apiService.deleteItem(id);
        dispatch({ type: 'DELETE_ITEM', payload: id });
        setTimeout(() => dispatch({ type: 'CLEAR_MESSAGES' }), 3000);
      } catch (error) {
        dispatch({ type: 'SET_ITEM_MESSAGE', payload: error.message });
      }
    }
  };

  const handleEditItem = (item) => {
    dispatch({ type: 'SET_EDITING_ITEM', payload: item });
  };

  const handleCancelEdit = () => {
    dispatch({ type: 'SET_EDITING_ITEM', payload: null });
  };

  return (
    <div className="dashboard">
      <Header />
      
      <div className="dashboard-content">
        <div className="dashboard-grid">
          <div className="form-section">
            <ItemForm
              onSubmit={state.editingItem ? handleUpdateItem : handleCreateItem}
              editingItem={state.editingItem}
              onCancel={handleCancelEdit}
            />
          </div>
          
          <div className="list-section">
            <ItemList
              items={state.items}
              loading={state.itemsLoading}
              error={state.itemsError}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onRefresh={fetchItems}
            />
          </div>
        </div>

        {state.itemMessage && (
          <div className={`message ${state.itemMessage.includes('error') || state.itemMessage.includes('failed') ? 'error' : 'success'}`}>
            <span className="message-icon">
              {state.itemMessage.includes('error') || state.itemMessage.includes('failed') ? '⚠️' : '✅'}
            </span>
            {state.itemMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
