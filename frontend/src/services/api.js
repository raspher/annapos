async function request(endpoint, { method = "GET", body, headers = {} } = {}) {
    const options = {
        method,
        credentials: "include", // always send cookies
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }
    let url = `${import.meta.env.VITE_API_BASE_URL}${endpoint}`;

    const res = await fetch(url, options);

    if (!res.ok) {
        let errorMessage = `Request to ${url} failed with status ${res.status}`;
        try {
            const errData = await res.json();
            errorMessage = errData.message || errorMessage;
        } catch {
            /* ignore JSON parse errors */
        }
        throw new Error(errorMessage);
    }

    return res.json();
}

export const AuthAPI = {
    cookie: () => request("/auth/cookie"),
    login: (email, password) => request("/auth/login", { method: "POST", body: { email, password } }),
    logout: () => request("/auth/logout", { method: "POST" }),
};
