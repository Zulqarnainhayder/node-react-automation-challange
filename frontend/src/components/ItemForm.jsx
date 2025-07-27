import { useState, useEffect } from 'react';
import './ItemForm.css';

const ItemForm = ({ onSubmit, editingItem, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    if (onCancel) onCancel();
  };

  return (
    <div className="item-form-container">
      <div className="form-header">
        <h2>{editingItem ? 'Edit Item' : 'Create New Item'}</h2>
        {editingItem && (
          <button onClick={handleCancel} className="cancel-btn">
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="item-form">
        <div className="form-group">
          <label htmlFor="name">Item Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter item name"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter item description (optional)"
            rows="3"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting || !formData.name.trim()}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                {editingItem ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              editingItem ? 'Update Item' : 'Create Item'
            )}
          </button>

          {editingItem && (
            <button 
              type="button" 
              onClick={handleCancel}
              className="cancel-action-btn"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ItemForm;
