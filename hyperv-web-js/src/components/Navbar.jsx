import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, ShoppingCart, X, Zap } from "lucide-react";
import AnimatedButton from "@/components/ui/animated-button"
import { useNavigate, Link } from "react-router-dom";
 

const links = [
  { href: "#flavors", label: "Flavors" }, 
  { href: "#shop", label: "Shop" },
  { href: "/track-order", label: "Track Order" },
];

export function Navbar({ cartCount = 0, onCartClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  
const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-black/70 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="/" className="flex items-center gap-2 font-display text-xl tracking-wide sm:text-2xl">
          <span>HYPER</span>
          <span className="relative inline-flex items-center text-yellow-400">
            V
            <Zap className="absolute -right-3 -top-1 size-3 fill-yellow-400 text-yellow-400 sm:-right-4 sm:size-4" />
          </span>
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) =>
            l.href.startsWith("/") ? (
              <Link
                key={l.href}
                to={l.href}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            )
          )}
          <AnimatedButton
      type="button"
      onClick={() => navigate("/cart")}
      className="inline-flex items-center gap-2 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-black transition-transform hover:scale-105"
    >
      <ShoppingCart className="size-3.5" />
      Cart ({cartCount})
    </AnimatedButton>
        </nav>

        <a
          onClick={() => setOpen((o) => !o)}
          className="grid size-10 place-items-center rounded-full border border-white/15 text-white md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </a>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-white/10 bg-black/95 px-5 py-6 md:hidden"
        >
          <div className="flex flex-col gap-5">
            {links.map((l) =>
              l.href.startsWith("/") ? (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80"
                >
                  {l.label}
                </a>
              )
            )}
            <AnimatedButton
              type="button"
              onClick={() => {
                setOpen(false);
                onCartClick?.();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-black"
            >
              <ShoppingCart className="size-3.5" />
              Cart ({cartCount})
            </AnimatedButton>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
