import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Loader2, PackageSearch } from "lucide-react";
import { trackOrder } from "@/lib/api";

const STATUS_STYLES = {
  pending: { label: "Pending", className: "bg-white/10 text-white/70" },
  paid: { label: "Paid", className: "bg-blue-500/15 text-blue-400" },
  shipped: { label: "Shipped", className: "bg-emerald-500/15 text-emerald-400" },
  cancelled: { label: "Cancelled", className: "bg-red-500/15 text-red-400" },
};

export function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(
    searchParams.get("order") ?? ""
  );
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [order, setOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const search = async (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const result = await trackOrder(trimmed.toUpperCase());
      setOrder(result);
      setStatus("success");
    } catch (err) {
      setOrder(null);
      setStatus("error");
      setErrorMessage(
        err.message === "Order not found"
          ? "We couldn't find an order with that number. Double-check it and try again."
          : err.message || "Something went wrong. Please try again."
      );
    }
  };

  // Auto-search if an order number arrived via ?order= (e.g. linked from
  // the checkout confirmation screen).
  useEffect(() => {
    const fromQuery = searchParams.get("order");
    if (fromQuery) search(fromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    search(orderNumber);
  };

  return (
    <section className="min-h-screen px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.5em] text-white/50">
          Track
        </p>
        <h1 className="mt-4 font-display text-4xl uppercase sm:text-5xl">
          Order status
        </h1>
        <p className="mt-3 text-sm text-white/60">
          Enter the confirmation number from your order to check its status.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <input
            required
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="HV-XXXXXXXX"
            className="flex-1 rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm uppercase tracking-widest text-white outline-none placeholder:text-white/30 focus:border-white/40"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Search className="size-3.5" />
            )}
            {status === "loading" ? "Searching..." : "Search"}
          </button>
        </form>

        {status === "error" && (
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
            {errorMessage}
          </p>
        )}

        {status === "success" && order && (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-display text-2xl tracking-widest">
                  {order.orderNumber}
                </p>
                <p className="mt-1 text-xs text-white/50">{order.createdAt}</p>
              </div>

              <span
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] ${
                  STATUS_STYLES[order.status]?.className ??
                  "bg-white/10 text-white/70"
                }`}
              >
                {STATUS_STYLES[order.status]?.label ?? order.status}
              </span>
            </div>

            <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-white/80">
                    {item.quantity}× {item.name}
                  </span>
                  <span className="text-white/60">
                    ${item.subtotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                Subtotal
              </span>
              <span className="font-display text-2xl">
                ${order.subtotal.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {status === "idle" && (
          <div className="mt-16 flex flex-col items-center gap-3 text-center text-white/25">
            <PackageSearch className="size-10" />
            <p className="text-xs uppercase tracking-[0.2em]">
              Enter an order number above
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
