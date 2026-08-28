import { useMemo, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FlavorShowcase } from "@/components/FlavorShowcase";
import { Shop } from "@/components/Shop";
import { Footer } from "@/components/Footer";
import { Cart } from "@/components/Cart";
import { flavors } from "@/data/flavors";
import { Contact } from "./components/contact";
import { Admin } from "@/components/Admin";
import { TrackOrder } from "@/components/TrackOrder";
export default function App() {
  const [cart, setCart] = useState({});

  // Add product to cart
  const addToCart = (id) => {
    setCart((current) => ({
      ...current,
      [id]: (current[id] ?? 0) + 1,
    }));
  };

  // Update product quantity
  const updateQuantity = (id, delta) => {
    setCart((current) => {
      const nextQty = (current[id] ?? 0) + delta;

      if (nextQty <= 0) {
        const { [id]: removed, ...rest } = current;
        return rest;
      }

      return {
        ...current,
        [id]: nextQty,
      };
    });
  };

  // Clear cart (used after a successful checkout)
  const clearCart = () => {
    setCart({});
  };

  // Total cart items
  const totalItems = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0
  );

  // Cart products
  const cartItems = useMemo(() => {
    return flavors
      .filter((flavor) => cart[flavor.id])
      .map((flavor) => ({
        ...flavor,
        quantity: cart[flavor.id],
        subtotal: flavor.price * cart[flavor.id],
      }));
  }, [cart]);

  // Cart subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white">
        <div className="grain" />

        <Navbar cartCount={totalItems} />

        <Routes>
          {/* HOME */}
          <Route
            path="/"
            element={
              <main>
                <Hero />
                <FlavorShowcase
                  onAddToCart={addToCart}
                />

                <Shop
                  addToCart={addToCart}
                />
                
                
                <Footer />
              </main>
            }
          />

          {/* CART */}
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                subtotal={subtotal}
                updateQuantity={updateQuantity}
                clearCart={clearCart}
              />
            }
          />
          {/* CONTACT */}
          <Route
            path="/contact"
            element={
              <Contact />
            }
          />

          {/* TRACK ORDER */}
          <Route path="/track-order" element={<TrackOrder />} />

          {/* ADMIN */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}