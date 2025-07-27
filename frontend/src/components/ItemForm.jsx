import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Button from './UI/Button';
import Input from './UI/Input';
import Textarea from './UI/Textarea';
import Card from './UI/Card';
import './ItemForm.css';

const ItemForm = ({ onSubmit, editingItem, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        description: editingItem.description || ''
      });
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [editingItem]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingItem) {
        await onSubmit(editingItem.id, formData);
      } else {
        await onSubmit(formData);
        setFormData({ name: '', description: '' });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    if (onCancel) onCancel();
  };

  return (
    <Card className="item-form" padding="medium">
      <h2 className="form-title">{editingItem ? 'Edit Item' : 'Create New Item'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <Input
            label="Item Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter item name"
            required
          />
          {!formData.name.trim() && (
            <div className="input-error-text">Item Name is required</div>
          )}
        </div>

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter item description (optional)"
          rows={3}
        />

        <div className="form-actions">
          <Button 
            type="submit" 
            variant="primary" 
            loading={loading}
            className="submit-btn"
            disabled={!formData.name.trim() || loading}
          >
            {editingItem ? 'Update Item' : 'Create Item'}
          </Button>
          
          {editingItem && (
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onCancel}
              disabled={loading}
              className="cancel-btn"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default ItemForm;
