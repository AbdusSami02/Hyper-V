import { motion } from "framer-motion";
import { flavors } from "@/data/flavors";
import { Activity, Target, Zap } from "lucide-react";
import { GooeyTextReveal } from "@/components/ui/gooey-text-reveal"

const canOrder = [flavors[0], flavors[1], flavors[2]];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 sm:pt-40">
      {/* ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#ff2d78] opacity-25 blur-[110px] sm:h-96 sm:w-96" />
        <div className="absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-[#ff9d2e] opacity-20 blur-[120px]" />
        <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-[#29c5ff] opacity-25 blur-[110px] sm:h-96 sm:w-96" />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <GooeyTextReveal
      mode="scroll"
      duration={1.8}
      stagger={0.12}
      blurAmount={0.4}
      className="max-w-4xl"
    >
      <h2 className="text-3xl font-semibold leading-none">
        Three Flavors. One Voltage.
      </h2>
    </GooeyTextReveal>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-5 font-display text-5xl uppercase leading-[0.92] sm:text-7xl lg:text-8xl"
        >
          Hyper <span className="text-yellow-400">V</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="mt-1 font-display text-lg uppercase tracking-[0.35em] text-white/60 sm:text-xl"
        >
          Energy Drink
        </motion.p>
      </div>

      {/* cans row */}
      <div className="relative mx-auto mt-10 flex max-w-6xl items-end justify-center gap-1 px-4 sm:mt-14 sm:gap-4">
        {canOrder.map((f, i) => {
          const isCenter = i === 1;
          return (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 80, rotate: i === 0 ? -6 : i === 2 ? 6 : 0 }}
              animate={{ opacity: 1, y: 0, rotate: i === 0 ? -3 : i === 2 ? 3 : 0 }}
              transition={{ duration: 0.8, delay: 0.25 + i * 0.12, ease: "easeOut" }}
              whileHover={{ y: -14, rotate: 0, transition: { duration: 0.3 } }}
              className="relative"
              style={{ zIndex: isCenter ? 2 : 1 }}
            >
              <motion.div
                className="pointer-events-none absolute inset-x-[-40%] bottom-4 top-6 -z-10 rounded-full blur-3xl"
                style={{ backgroundColor: f.color }}
                animate={{ opacity: [0.3, 0.55, 0.3] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.img
                src={f.image}
                alt={`${f.name} can`}
                animate={{ y: [0, isCenter ? -12 : -7, 0] }}
                transition={{ duration: 4.5 + i * 0.6, repeat: Infinity, ease: "easeInOut" }}
                className="w-[26vw] max-w-[190px] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.6)] sm:max-w-[240px]"
                style={{ height: isCenter ? undefined : undefined }}
                width={340}
                height={790}
              />
            </motion.div>
          );
        })}
      </div>

      {/* feature pills, mirrors poster footer row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="relative mx-auto mt-14 flex max-w-2xl flex-wrap items-center justify-center gap-x-10 gap-y-5 px-5 sm:mt-16"
      >
        <Feature icon={<Zap className="size-4" />} label="Energy Boost" color="#ff2d78" />
        <span className="hidden h-6 w-px bg-white/15 sm:block" />
        <Feature icon={<Target className="size-4" />} label="Mental Focus" color="#ff9d2e" />
        <span className="hidden h-6 w-px bg-white/15 sm:block" />
        <Feature icon={<Activity className="size-4" />} label="Peak Performance" color="#29c5ff" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="relative mt-8 text-center font-display text-sm uppercase tracking-[0.4em] text-white/50 sm:text-base"
      >
        Fuel your energy. <span className="text-white">Live hyper.</span>
      </motion.p>
      
{/* Infinite Text Marquee */}
<div className="relative mt-16 overflow-hidden border-y border-white/10 py-4">
  <motion.div
    className="flex w-max"
    animate={{ x: ["0%", "-50%"] }}
    transition={{
      duration: 18,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    {[...Array(2)].map((_, index) => (
      <div
        key={index}
        className="flex items-center whitespace-nowrap"
      >
        <span className="mx-6 font-display text-2xl uppercase tracking-[0.2em] text-yellow-400 sm:text-3xl">
          HYPER V
        </span>

        <span className="text-xl text-white/30">✦</span>

        <span className="mx-6 font-display text-2xl uppercase tracking-[0.2em] text-white/70 sm:text-3xl">
          LIVE HYPER
        </span>

        <span className="text-xl text-white/30">✦</span>

        <span className="mx-6 font-display text-2xl uppercase tracking-[0.2em] text-[#ff2d78] sm:text-3xl">
          UNLEASH YOUR ENERGY
        </span>

        <span className="text-xl text-white/30">✦</span>

        <span className="mx-6 font-display text-2xl uppercase tracking-[0.2em] text-[#29c5ff] sm:text-3xl">
          THREE FLAVORS
        </span>

        <span className="text-xl text-white/30">✦</span>

        <span className="mx-6 font-display text-2xl uppercase tracking-[0.2em] text-[#ff9d2e] sm:text-3xl">
          ONE VOLTAGE
        </span>

        <span className="text-xl text-white/30">✦</span>
      </div>
    ))}
  </motion.div>
</div>

    </section>
  );
}

function Feature({ icon, label, color }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="grid size-8 place-items-center rounded-full border"
        style={{ borderColor: color, color }}
      >
        {icon}
      </span>
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">{label}</span>
    </div>
  );
}
