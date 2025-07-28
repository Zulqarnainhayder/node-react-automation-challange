const API_URL = 'http://backend:4000';

class ApiService {
  // Get token from localStorage
  getToken() {
    try {
      const authState = localStorage.getItem('authState');
      if (authState) {
        const { token } = JSON.parse(authState);
        return token;
      }
    } catch (error) {
      console.error('Error getting token from localStorage:', error);
    }
    return null;
  }

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const token = this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error');
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Items endpoints
  async getItems() {
    return this.request('/items');
  }

  async createItem(item) {
    return this.request('/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateItem(id, item) {
    return this.request(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async deleteItem(id) {
    return this.request(`/items/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();
