import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { flavors } from "../data/flavors";
import { GooeyTextReveal } from "@/components/ui/gooey-text-reveal"


export function FlavorShowcase({ onAddToCart }) {
  const [activeId, setActiveId] = useState(flavors[0].id);
  const sectionRef = useRef(null);
  const isChanging = useRef(false);

  const active = flavors.find((f) => f.id === activeId);

  const currentIndex = flavors.findIndex(
    (flavor) => flavor.id === activeId
  );

  const changeFlavor = (direction) => {
    if (isChanging.current) return;

    const nextIndex = currentIndex + direction;

    // Last flavor + scroll down = allow page to continue
    if (nextIndex >= flavors.length) {
      return;
    }

    // First flavor + scroll up = allow page to go back
    if (nextIndex < 0) {
      return;
    }

    isChanging.current = true;

    setActiveId(flavors[nextIndex].id);

    setTimeout(() => {
      isChanging.current = false;
    }, 500);
  };

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const handleWheel = (event) => {
      const rect = section.getBoundingClientRect();

      // Only control scrolling when the section is basically in view
      const isInSection =
        rect.top <= 100 && rect.bottom >= window.innerHeight - 100;

      if (!isInSection) return;

      const direction = event.deltaY > 0 ? 1 : -1;
      const nextIndex = currentIndex + direction;

      /*
       * If there are more flavors:
       * stop normal page scrolling and change flavor.
       */
      if (
        (direction > 0 && currentIndex < flavors.length - 1) ||
        (direction < 0 && currentIndex > 0)
      ) {
        event.preventDefault();
        changeFlavor(direction);
      }

      /*
       * If we're at the last flavor and scrolling down,
       * DON'T preventDefault().
       *
       * Browser continues to the next section.
       */

      /*
       * If we're at the first flavor and scrolling up,
       * DON'T preventDefault().
       *
       * Browser goes back to previous section.
       */
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [currentIndex]);

  return (
    <section
      ref={sectionRef}
      id="flavors"
      className="relative min-h-screen py-24 sm:py-32"
    >
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30 blur-[130px] transition-colors duration-700"
        style={{ backgroundColor: active.color }}
      />

      <div className="mx-auto max-w-7xl px-5">
        {/* Heading */}
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.5em] text-white/50">
            Pick your voltage
          </p>

          <GooeyTextReveal
                mode="scroll"
                duration={1.8}
                stagger={0.12}
                blurAmount={0.4}
                className="max-w-7xl"
              >
                <h2 className="text-6xl font-semibold leading-none">
                  The Flavor Lineup
                </h2>
              </GooeyTextReveal>
        </div>

        {/* Flavor buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {flavors.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveId(f.id)}
              className="relative rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em]"
              style={{
                color: activeId === f.id ? "#000" : "#fff",
              }}
            >
              {activeId === f.id && (
                <motion.span
                  layoutId="flavor-pill"
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: f.color,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 32,
                  }}
                />
              )}

              {activeId !== f.id && (
                <span className="absolute inset-0 rounded-full border border-white/15" />
              )}

              <span className="relative z-10">
                {f.name}
              </span>
            </button>
          ))}
        </div>

        {/* Main flavor */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -30,
            }}
            transition={{
              duration: 0.4,
            }}
            className="mt-14 grid items-center gap-10 md:grid-cols-2 md:gap-16"
          >
            {/* Can */}
            <div className="relative flex h-[380px] items-center justify-center sm:h-[460px]">
              <div
                className="pointer-events-none absolute size-64 rounded-full blur-[90px] sm:size-80"
                style={{
                  backgroundColor: active.color,
                  opacity: 0.5,
                }}
              />

              <motion.img
                initial={{
                  scale: 0.85,
                  rotate: -4,
                }}
                animate={{
                  scale: 1,
                  rotate: 0,
                  y: [0, -10, 0],
                }}
                transition={{
                  scale: {
                    duration: 0.5,
                  },
                  rotate: {
                    duration: 0.5,
                  },
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                src={active.image}
                alt={`${active.name} can`}
                width={340}
                height={790}
                className="relative h-full w-auto object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.65)]"
              />
            </div>

            {/* Information */}
            <div>
              <p
                className="text-xs font-bold uppercase tracking-[0.35em]"
                style={{
                  color: active.color,
                }}
              >
                {active.tagline}
              </p>

              <h3 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
                {active.name}
              </h3>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
                {active.description}
              </p>

              {/* Stats */}
              <div className="mt-8 space-y-5">
                {active.stats.map((s, i) => (
                  <div key={s.label}>
                    <div className="flex items-baseline justify-between text-xs font-bold uppercase tracking-[0.2em]">
                      <span className="text-white/70">
                        {s.label}
                      </span>

                      <span style={{ color: active.color }}>
                        {s.value}%
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        key={active.id + s.label}
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${s.value}%`,
                        }}
                        transition={{
                          duration: 0.7,
                          delay: 0.1 * i,
                        }}
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: active.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div className="mt-8 flex flex-wrap gap-3">
                {active.notes.map((n) => (
                  <span
                    key={n}
                    className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/70"
                  >
                    {n}
                  </span>
                ))}
              </div>

              {/* Price */}
              <div className="mt-8 flex items-center gap-4">
                <span className="font-display text-3xl">
                  ${active.price.toFixed(2)}
                </span>

                <button
                  type="button"
                  onClick={() => onAddToCart?.(active.id)}
                  className="rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-black transition-transform hover:scale-105"
                  style={{
                    backgroundColor: active.color,
                  }}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}