// Talks to the hyperv-server backend.
//
// In dev, requests go to the relative "/api/..." path, which vite.config.js
// proxies to the backend (see server.proxy) — no CORS headaches.
// For a production build, set VITE_API_URL to the deployed backend's origin
// (e.g. https://api.hyperv-energy.com) and it'll be used instead.
const API_BASE = import.meta.env.VITE_API_URL ?? "";

async function request(path, options = {}) {
  const { headers, ...rest } = options;
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...headers },
    ...rest,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? `Request failed (${res.status})`);
  }

  return data;
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

export function fetchProducts() {
  return request("/api/products");
}

export function submitCheckout({ items, customer }) {
  return request("/api/checkout", {
    method: "POST",
    body: JSON.stringify({ items, customer }),
  });
}

export function submitContact({ name, email, message }) {
  return request("/api/contact", {
    method: "POST",
    body: JSON.stringify({ name, email, message }),
  });
}

export function trackOrder(orderNumber) {
  return request(`/api/checkout/${encodeURIComponent(orderNumber)}`);
}

// --- Admin ---------------------------------------------------------------

export function adminLogin(password) {
  return request("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

export function adminLogout(token) {
  return request("/api/admin/logout", {
    method: "POST",
    headers: authHeaders(token),
  });
}

export function fetchAdminOrders(token) {
  return request("/api/admin/orders", { headers: authHeaders(token) });
}

export function updateOrderStatus(token, orderNumber, status) {
  return request(`/api/admin/orders/${orderNumber}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
}

export function fetchAdminProducts(token) {
  return request("/api/admin/products", { headers: authHeaders(token) });
}

export function updateProductStock(token, id, stock) {
  return request(`/api/admin/products/${id}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ stock }),
  });
}
