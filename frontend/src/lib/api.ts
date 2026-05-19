const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export class ApiService {
  private static async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
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

  // Products
  static async getProducts(filters?: any) {
    const params = new URLSearchParams(filters);
    return this.request(`/products?${params}`);
  }

  static async getProduct(id: string) {
    return this.request(`/products/${id}`);
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

  // Add more API methods as needed
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
