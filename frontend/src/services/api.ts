import axios, {type AxiosInstance, type AxiosResponse } from 'axios';

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: import.meta.env.API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add request interceptor to include auth token
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Add response interceptor to handle auth errors
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    // Auth endpoints
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
        return response.data;
    }

    async getProfile(): Promise<{ user: any }> {
        const response = await this.api.get('/auth/profile');
        return response.data;
    }

    async logout(): Promise<{ message: string }> {
        const response = await this.api.post('/auth/logout');
        return response.data;
    }

    // Product endpoints
    async getProducts(params?: {
        limit?: number;
        offset?: number;
        category?: string;
        search?: string;
        sort?: string;
        order?: 'asc' | 'desc';
    }): Promise<ProductResponse> {
        const response: AxiosResponse<ProductResponse> = await this.api.get('/products', { params });
        return response.data;
    }

    async getProduct(id: number): Promise<Product> {
        const response: AxiosResponse<Product> = await this.api.get(`/products/${id}`);
        return response.data;
    }

    async searchProducts(query: string, limit: number = 10): Promise<SearchResult> {
        const response: AxiosResponse<SearchResult> = await this.api.get(`/products/search/${query}`, {
            params: { limit }
        });
        return response.data;
    }

    async getProductsByCategory(category: string, params?: {
        limit?: number;
        offset?: number;
    }): Promise<ProductResponse> {
        const response: AxiosResponse<ProductResponse> = await this.api.get(`/products/category/${category}`, { params });
        return response.data;
    }

    async updateProductLocalData(id: number, data: {
        stock_quantity?: number;
        rating_rate?: number;
        rating_count?: number;
    }): Promise<{ message: string; product_id: number }> {
        const response = await this.api.patch(`/products/${id}/local`, data);
        return response.data;
    }

    // Category endpoints
    async getCategories(): Promise<CategoryResponse> {
        const response: AxiosResponse<CategoryResponse> = await this.api.get('/categories');
        return response.data;
    }

    async getCategory(id: number): Promise<Category> {
        const response: AxiosResponse<Category> = await this.api.get(`/categories/${id}`);
        return response.data;
    }

    async getCategoryProducts(id: number, params?: {
        limit?: number;
        offset?: number;
    }): Promise<ProductResponse> {
        const response: AxiosResponse<ProductResponse> = await this.api.get(`/categories/${id}/products`, { params });
        return response.data;
    }

    async syncCategories(): Promise<{ message: string; synced_count: number }> {
        const response = await this.api.post('/categories/sync');
        return response.data;
    }

    // Customer endpoints (placeholder - would need to be implemented in backend)
    async getCustomers(): Promise<{ customers: Customer[]; total: number }> {
        const response = await this.api.get('/customers');
        return response.data;
    }

    async createCustomer(data: {
        name: string;
        email?: string;
        phone?: string;
        address?: string;
    }): Promise<Customer> {
        const response: AxiosResponse<Customer> = await this.api.post('/customers', data);
        return response.data;
    }

    // Order endpoints
    async getOrders(params?: {
        limit?: number;
        offset?: number;
        status?: string;
        customer_id?: number;
        sort?: string;
        order?: 'asc' | 'desc';
    }): Promise<OrderResponse> {
        const response: AxiosResponse<OrderResponse> = await this.api.get('/orders', { params });
        return response.data;
    }

    async getOrder(id: number): Promise<Order> {
        const response: AxiosResponse<Order> = await this.api.get(`/orders/${id}`);
        return response.data;
    }

    async createOrder(orderData: CreateOrderRequest): Promise<{
        message: string;
        order: {
            id: number;
            order_number: string;
            total_amount: number;
            created_at: string;
        };
    }> {
        const response = await this.api.post('/orders', orderData);
        return response.data;
    }

    async updateOrderStatus(id: number, status: string): Promise<{
        message: string;
        order: {
            id: number;
            order_number: string;
            status: string;
        };
    }> {
        const response = await this.api.patch(`/orders/${id}/status`, { status });
        return response.data;
    }

    async getOrderStats(period: string = 'today'): Promise<StatsResponse> {
        const response: AxiosResponse<StatsResponse> = await this.api.get('/orders/stats/summary', {
            params: { period }
        });
        return response.data;
    }

    // Health check
    async healthCheck(): Promise<{ status: string; timestamp: string; environment: string }> {
        const response = await this.api.get('/health');
        return response.data;
    }
}

export const apiService = new ApiService();
export default apiService;




