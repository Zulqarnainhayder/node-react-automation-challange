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
      <div className="list-header">
        <h2>Your Items ({items.length})</h2>
        <button onClick={onRefresh} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No items yet</h3>
          <p>Create your first item using the form on the left</p>
        </div>
      ) : (
        <div className="items-grid">
          {items.map((item) => (
            <div key={item.id} className="item-card">
              <div className="item-content">
                <h3 className="item-name">{item.name}</h3>
                {item.description && (
                  <p className="item-description">{item.description}</p>
                )}
              </div>
              
              <div className="item-actions">
                <button 
                  onClick={() => onEdit(item)}
                  className="edit-btn"
                  title="Edit item"
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => onDelete(item.id)}
                  className="delete-btn"
                  title="Delete item"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemList;
