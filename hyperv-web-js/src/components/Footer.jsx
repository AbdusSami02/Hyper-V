import {
  ArrowUpRight,
  Zap,
} from "lucide-react";
import {Link} from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">

        {/* Main Footer */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff9d2e] text-black">
                <Zap size={22} fill="currentColor" />
              </div>

              <span className="text-2xl font-black tracking-wider">
                HYPER<span className="text-yellow-400"> V</span>
              </span>
            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-zinc-500">
              Built for the ones who keep moving. Hyper V brings bold
              flavors, high-energy vibes, and a mindset designed for
              the next level.
            </p>
          </div>
          
          {/* Navigation */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-white">
              Explore
            </h3>

            <ul className="mt-6 space-y-4 text-sm text-zinc-500">
              <li>
                <a
                  href="/"
                  className="transition hover:text-cyan-400"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="#shop"
                  className="transition hover:text-cyan-400"
                >
                  Shop
                </a>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="transition hover:text-cyan-400"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Flavors */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-white">
              Flavors
            </h3>

            <ul className="mt-6 space-y-4 text-sm text-zinc-500">
              <li>
                <a
                  href="#shop"
                  className="transition hover:text-cyan-400"
                >
                  Neon Rush
                </a>
              </li>

              <li>
                <a
                  href="#shop"
                  className="transition hover:text-cyan-400"
                >
                  Turbo Tropic
                </a>
              </li>

              <li>
                <a
                  href="#shop"
                  className="transition hover:text-cyan-400"
                >
                  Arctic Pulse
                </a>
              </li>

              <li>
                <a
                  href="#shop"
                  className="flex items-center gap-1 transition hover:text-cyan-400"
                >
                  View All
                  <ArrowUpRight size={14} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-white/10" />

        {/* Bottom */}
        <div className="flex flex-col gap-5 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Hyper V. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a
              href="#"
              className="transition hover:text-cyan-400"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="transition hover:text-cyan-400"
            >
              Terms & Conditions
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
export { Footer };