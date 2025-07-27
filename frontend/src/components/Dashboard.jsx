import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Header from './Header';
import ItemForm from './ItemForm';
import ItemList from './ItemList';
import Message from './UI/Message';
import apiService from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { state, dispatch } = useAppContext();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

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
      setMessage(error.message);
      setMessageType('error');
    }
  };

  const handleCreateItem = async (itemData) => {
    try {
      const newItem = await apiService.createItem(itemData);
      dispatch({ type: 'ADD_ITEM', payload: newItem });
      setMessage('Item created successfully!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    }
  };

  const handleUpdateItem = async (id, itemData) => {
    try {
      const updatedItem = await apiService.updateItem(id, itemData);
      dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
      setMessage('Item updated successfully!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await apiService.deleteItem(id);
        dispatch({ type: 'DELETE_ITEM', payload: id });
        setMessage('Item deleted successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage(error.message);
        setMessageType('error');
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
        {message && (
          <Message 
            type={messageType} 
            onClose={() => setMessage('')}
          >
            {message}
          </Message>
        )}
        
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
      </div>
    </div>
  );
};

export default Dashboard;
