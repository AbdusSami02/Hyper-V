import { useState } from "react";
import { Minus, Plus, ShoppingCart, Loader2, CheckCircle2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { submitCheckout } from "@/lib/api";

export function Cart({ cartItems, subtotal, updateQuantity, clearCart }) {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({ name: "", email: "" });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [orderNumber, setOrderNumber] = useState(null);

  const continueShopping = () => {
    navigate("/");
  };

  const onCustomerChange = (e) => {
    setCustomer((c) => ({ ...c, [e.target.name]: e.target.value }));
  };

  const onCheckout = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const result = await submitCheckout({
        items: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
        customer,
      });

      setOrderNumber(result.orderNumber);
      setStatus("success");
      clearCart?.();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="relative min-h-screen py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-white/50">
              Cart
            </p>

            <h2 className="mt-4 font-display text-4xl uppercase sm:text-5xl">
              Your pack
            </h2>
          </div>

          <button
            type="button"
            onClick={continueShopping}
            className="rounded-full border border-white/15 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/5"
          >
            Continue shopping
          </button>
        </div>

        {/* Cart container */}
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 sm:p-8">

          {/* Order confirmed */}
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center gap-5 py-12 text-center">
              <CheckCircle2 className="size-12 text-emerald-400" />

              <div>
                <h3 className="font-display text-3xl uppercase">
                  Order placed
                </h3>

                <p className="mt-2 text-sm text-white/60">
                  Confirmation number
                </p>
                <p className="mt-1 font-display text-2xl tracking-widest text-white">
                  {orderNumber}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={continueShopping}
                  className="rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black"
                >
                  Continue shopping
                </button>

                <Link
                  to={`/track-order?order=${orderNumber}`}
                  className="rounded-full border border-white/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/5"
                >
                  Track this order
                </Link>
              </div>
            </div>
          ) : cartItems.length === 0 ? (

            /* Empty cart */
            <div className="flex flex-col items-center justify-center gap-5 py-12 text-center">

              <ShoppingCart className="size-12 text-white/35" />

              <div>
                <h3 className="font-display text-3xl uppercase">
                  Cart is empty
                </h3>

                <p className="mt-2 text-sm text-white/60">
                  Add a flavor from the shop to build your pack.
                </p>
              </div>

              <button
                type="button"
                onClick={continueShopping}
                className="rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black"
              >
                Shop flavors
              </button>
            </div>
          ) : (

            /* Cart items */
            <div className="space-y-5">

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center"
                >

                  {/* Product image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-auto object-contain"
                  />

                  <div className="flex-1">

                    {/* Product information */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-display text-2xl uppercase">
                          {item.name}
                        </p>

                        <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                          {item.tagline}
                        </p>
                      </div>

                      <span className="font-display text-2xl">
                        ${item.subtotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Quantity */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                      <div className="flex items-center gap-2 rounded-full border border-white/10 px-2 py-1">

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, -1)
                          }
                          className="grid size-7 place-items-center rounded-full bg-white/5 hover:bg-white/10"
                          aria-label={`Decrease ${item.name}`}
                        >
                          <Minus className="size-3" />
                        </button>

                        <span className="min-w-5 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, 1)
                          }
                          className="grid size-7 place-items-center rounded-full bg-white/5 hover:bg-white/10"
                          aria-label={`Increase ${item.name}`}
                        >
                          <Plus className="size-3" />
                        </button>

                      </div>

                      <span className="text-xs uppercase tracking-[0.2em] text-white/60">
                        ${item.price.toFixed(2)} each
                      </span>

                    </div>
                  </div>
                </div>
              ))}

              {/* Checkout form + summary */}
              <form
                onSubmit={onCheckout}
                className="space-y-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5"
              >

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                      Name
                    </label>
                    <input
                      required
                      name="name"
                      value={customer.name}
                      onChange={onCustomerChange}
                      placeholder="Your name"
                      className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/40"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={customer.email}
                      onChange={onCustomerChange}
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/40"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm uppercase tracking-[0.2em] text-white/60">
                  <span>Subtotal</span>

                  <span className="font-display text-3xl text-white">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {status === "error" && (
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" && (
                    <Loader2 className="size-3.5 animate-spin" />
                  )}
                  {status === "submitting" ? "Placing order..." : "Checkout"}
                </button>

              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
