import { useEffect, useState } from "react";
import { Lock, Loader2, RefreshCw, LogOut, Package, ClipboardList } from "lucide-react";
import {
  adminLogin,
  adminLogout,
  fetchAdminOrders,
  updateOrderStatus,
  fetchAdminProducts,
  updateProductStock,
} from "@/lib/api";

const TOKEN_KEY = "hyperv_admin_token";
const STATUS_OPTIONS = ["pending", "paid", "shipped", "cancelled"];

export function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));

  return token ? (
    <Dashboard token={token} onLogout={() => setToken(null)} />
  ) : (
    <Login onLoggedIn={setToken} />
  );
}

function Login({ onLoggedIn }) {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | error
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const { token } = await adminLogin(password);
      sessionStorage.setItem(TOKEN_KEY, token);
      onLoggedIn(token);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Login failed");
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-5">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.03] p-8"
      >
        <div className="flex items-center gap-2 text-white/60">
          <Lock className="size-4" />
          <p className="text-xs font-bold uppercase tracking-[0.3em]">
            Admin
          </p>
        </div>

        <h1 className="mt-4 font-display text-3xl uppercase">Sign in</h1>

        <input
          type="password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-6 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/40"
        />

        {status === "error" && (
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" && <Loader2 className="size-3.5 animate-spin" />}
          {status === "submitting" ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </section>
  );
}

function Dashboard({ token, onLogout }) {
  const [orders, setOrders] = useState(null);
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    setError("");
    try {
      const [ordersData, productsData] = await Promise.all([
        fetchAdminOrders(token),
        fetchAdminProducts(token),
      ]);
      setOrders(ordersData);
      setProducts(productsData);
    } catch (err) {
      if (err.message === "Not authenticated") {
        sessionStorage.removeItem(TOKEN_KEY);
        onLogout();
        return;
      }
      setError(err.message || "Failed to load");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onStatusChange = async (orderNumber, status) => {
    const previous = orders;
    setOrders((current) =>
      current.map((o) => (o.orderNumber === orderNumber ? { ...o, status } : o))
    );
    try {
      await updateOrderStatus(token, orderNumber, status);
    } catch (err) {
      setOrders(previous);
      setError(err.message || "Failed to update order");
    }
  };

  const onStockChange = async (id, stock) => {
    const previous = products;
    setProducts((current) =>
      current.map((p) => (p.id === id ? { ...p, stock } : p))
    );
    try {
      await updateProductStock(token, id, stock);
    } catch (err) {
      setProducts(previous);
      setError(err.message || "Failed to update stock");
    }
  };

  const onLogoutClick = async () => {
    try {
      await adminLogout(token);
    } catch {
      // ignore — we're clearing the local token regardless
    }
    sessionStorage.removeItem(TOKEN_KEY);
    onLogout();
  };

  return (
    <section className="min-h-screen px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-white/50">
              Admin
            </p>
            <h1 className="mt-4 font-display text-4xl uppercase sm:text-5xl">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={load}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/5 disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              type="button"
              onClick={onLogoutClick}
              className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/5"
            >
              <LogOut className="size-3.5" />
              Sign out
            </button>
          </div>
        </div>

        {error && (
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
            {error}
          </p>
        )}

        {/* Inventory */}
        <div className="mb-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 sm:p-8">
          <div className="mb-5 flex items-center gap-2 text-white/60">
            <Package className="size-4" />
            <p className="text-xs font-bold uppercase tracking-[0.3em]">Inventory</p>
          </div>

          {!products ? (
            <p className="text-sm text-white/50">Loading...</p>
          ) : (
            <div className="space-y-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div>
                    <p className="font-display text-xl uppercase">{p.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                      ${p.price.toFixed(2)} each
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                      Stock
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={p.stock}
                      onChange={(e) =>
                        onStockChange(p.id, Math.max(0, Number(e.target.value)))
                      }
                      className="w-24 rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/40"
                    />
                    {p.stock === 0 && (
                      <span className="rounded-full bg-red-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
                        Sold out
                      </span>
                    )}
                    {p.stock > 0 && p.stock <= 20 && (
                      <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-400">
                        Low
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders */}
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 sm:p-8">
          <div className="mb-5 flex items-center gap-2 text-white/60">
            <ClipboardList className="size-4" />
            <p className="text-xs font-bold uppercase tracking-[0.3em]">Orders</p>
          </div>

          {!orders ? (
            <p className="text-sm text-white/50">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-white/50">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.orderNumber}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-xl tracking-widest">
                        {order.orderNumber}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/50">
                        {order.customer.name} · {order.customer.email}
                      </p>
                      <p className="mt-1 text-xs text-white/40">
                        {order.createdAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-display text-xl">
                        ${order.subtotal.toFixed(2)}
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          onStatusChange(order.orderNumber, e.target.value)
                        }
                        className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white outline-none focus:border-white/40"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="bg-black">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-white/10 pt-3 text-xs text-white/60">
                    {order.items.map((item) => (
                      <span key={item.id}>
                        {item.quantity}× {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
