const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, { method = "GET", body, headers = {} } = {}) {
    const opts = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        credentials: "include",
    };
    if (body !== undefined) {
        opts.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    const res = await fetch(`${BASE_URL}${path}`, opts);
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
        const message = isJson ? (data?.message || JSON.stringify(data)) : data;
        throw new Error(message || `Request failed: ${res.status}`);
    }

    return data; // ✅ don't JSON.parse again
}

export const AuthAPI = {
  async login(email, password) {
      const json = await request("/auth/login", {
      method: "POST",
      body: { email, password }});
      return { user: json.user.name, accessToken: json.token };
  },
  async logout() {
    await request("/auth/logout", { method: "POST" });
    return true;
  },
  async cookie() {
    const data = await request("/auth/cookie");
    // backend returns: { user, token }
    return { user: data.user, accessToken: data.token };
  },
};

export const CategoriesAPI = {
  async list({ q } = {}) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    return request(`/categories?${params.toString()}`);
  },
};

export const ProductsAPI = {
  async list({ q, categoryId, limit = 20, offset = 0 } = {}) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categoryId) params.set("categoryId", String(categoryId));
    if (limit !== undefined) params.set("limit", String(limit));
    if (offset !== undefined) params.set("offset", String(offset));
    return request(`/products?${params.toString()}`);
  },
};

export const SyncAPI = {
  async fakestore() {
    return request("/sync/fakestore", { method: "POST" });
  },
};

export const OrdersAPI = {
  async create(items) {
    return request("/orders", { method: "POST", body: { items } });
  },
  async complete(id) {
    return request(`/orders/${id}/complete`, { method: "PATCH" });
  },
  async list({ limit = 50, offset = 0, status } = {}) {
    const params = new URLSearchParams();
    if (limit !== undefined) params.set("limit", String(limit));
    if (offset !== undefined) params.set("offset", String(offset));
    if (status) params.set("status", status);
    return request(`/orders?${params.toString()}`);
  },
  async get(id) {
    return request(`/orders/${id}`);
  },
  async remove(id) {
    return request(`/orders/${id}`, { method: "DELETE" });
  },
};
