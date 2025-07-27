import Button from './UI/Button';
import Card from './UI/Card';
import './ItemList.css';

const ItemList = ({ items, loading, error, onEdit, onDelete, onRefresh }) => {
  if (loading) {
    return (
      <div className="item-list-container">
        <div className="list-header">
          <h2>Your Items</h2>
        </div>
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="item-list-container">
        <div className="list-header">
          <h2>Your Items</h2>
          <button onClick={onRefresh} className="refresh-btn">
            🔄 Retry
          </button>
        </div>
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="item-list-container">
      <div className="items-header">
        <h2>Your Items ({items.length})</h2>
        <Button 
          onClick={onRefresh} 
          variant="success"
          size="small"
          className="refresh-btn" 
          disabled={loading}
          loading={loading}
        >
          🔄 Refresh
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No items yet</h3>
          <p>Create your first item using the form on the left</p>
        </div>
      ) : (
        <div className="items-grid">
          {items.map(item => (
            <Card key={item.id} className="item-card" padding="medium">
              <div className="item-content">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-description">{item.description || 'No description'}</p>
              </div>
              <div className="item-actions">
                <Button 
                  onClick={() => onEdit(item)} 
                  variant="secondary"
                  size="small"
                  className="edit-btn"
                  disabled={loading}
                >
                  ✏️ Edit
                </Button>
                <Button 
                  onClick={() => onDelete(item.id)} 
                  variant="danger"
                  size="small"
                  className="delete-btn"
                  disabled={loading}
                >
                  🗑️ Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemList;
