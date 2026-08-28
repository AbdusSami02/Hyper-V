import { motion } from "framer-motion";
import { flavors } from "@/data/flavors";

export function Shop({ addToCart }) {
  return (
    <section id="shop" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-white/50">Shop</p>
            <h2 className="mt-4 font-display text-4xl uppercase sm:text-5xl">Load your pack</h2>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {flavors.map((f, i) => (
            <motion.article
              key={f.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
                style={{ backgroundColor: f.color }}
              />

              <div className="relative flex h-52 items-center justify-center">
                <motion.img
                  src={f.image}
                  alt={`${f.name} can`}
                  loading="lazy"
                  width={340}
                  height={790}
                  className="h-full w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)]"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              <h3 className="relative mt-6 font-display text-2xl uppercase">{f.name}</h3>
              <p className="relative mt-1 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: f.color }}>
                {f.tagline}
              </p>

              <div className="relative mt-6 flex items-center justify-between">
                <span className="font-display text-2xl">${f.price.toFixed(2)}</span>
                <button
                  type="button"
                  onClick={() => addToCart(f.id)}
                  className="rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-black transition-transform hover:scale-105"
                  style={{ backgroundColor: f.color }}
                >
                  Add to cart
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
