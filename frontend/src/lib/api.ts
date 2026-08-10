const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export class ApiService {
  private static async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'API Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }
      return response.json();
    } catch (err: any) {
      console.warn(`[ApiService] Request to ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  // Auth
  static async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(data: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Products
  static async getProducts(filters?: any) {
    const query = filters ? new URLSearchParams(filters).toString() : '';
    return this.request(`/products${query ? `?${query}` : ''}`);
  }

  static async getProduct(idOrSlug: string) {
    return this.request(`/products/${idOrSlug}`);
  }

  // Cart
  static async getCart() {
    return this.request('/cart');
  }

  static async addToCart(productId: string, quantity: number) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  // Orders
  static async getOrders() {
    return this.request('/orders');
  }

  static async createOrder(data: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Dashboards
  static async getAdminDashboard() {
    return this.request('/admin/dashboard');
  }

  static async getSellerDashboard() {
    return this.request('/sellers/dashboard');
  }

  static async getUserProfile() {
    return this.request('/users/profile');
  }

  // Categories & Search
  static async getCategories() {
    return this.request('/categories');
  }

  static async search(query: string) {
    return this.request(`/search?q=${encodeURIComponent(query)}`);
  }

  // Generic REST helpers
  static async get(endpoint: string) {
    return this.request(endpoint);
  }

  static async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async delete(endpoint: string) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}
