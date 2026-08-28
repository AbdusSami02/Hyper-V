import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { submitContact } from "@/lib/api";

export function Contact() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("idle"); // idle | submitting | sent | error
  const [errorMessage, setErrorMessage] = useState("");

  const onChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      await submitContact(form);

      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      window.setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden pt-36 pb-24 sm:pt-44">
      
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#ff2d78] opacity-20 blur-[110px]" />
        <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-[#29c5ff] opacity-20 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5">

        {/* Back Button */}
        <div className="mb-10">
          <button
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Website
          </button>
        </div>

        {/* Heading */}
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.5em] text-yellow-400">
            Get in touch
          </p>

          <h1 className="mt-4 font-display text-5xl uppercase sm:text-6xl">
            Contact Us
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm text-white/60 sm:text-base">
            Questions about flavors, wholesale, or partnerships? Send us a
            message and the crew will get back to you.
          </p>
        </div>

        {/* Main Content */}
        <div className="mt-16 grid gap-10 md:grid-cols-5">

          {/* Contact Information */}
          <div className="space-y-6 md:col-span-2">

            <InfoCard
              icon={<Mail className="size-4" />}
              label="Email"
              value="hello@hyperv-energy.com"
              color="#ff2d78"
            />

            <InfoCard
              icon={<Phone className="size-4" />}
              label="Phone"
              value="+1 (555) 019-2842"
              color="#ff9d2e"
            />

            <InfoCard
              icon={<MapPin className="size-4" />}
              label="HQ"
              value="221 Voltage Ave, Los Angeles, CA"
              color="#29c5ff"
            />

          </div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={onSubmit}
            className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:col-span-3"
          >

            {/* Name */}
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                Name
              </label>

              <input
                required
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Your name"
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-yellow-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                Email
              </label>

              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-yellow-400"
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                Message
              </label>

              <textarea
                required
                name="message"
                value={form.message}
                onChange={onChange}
                rows={5}
                placeholder="How can we help?"
                className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-yellow-400"
              />
            </div>

            {/* Error Message */}
            {status === "error" && (
              <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                {errorMessage}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-yellow-400 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Send className="size-3.5" />
              )}

              {status === "submitting"
                ? "Sending..."
                : status === "sent"
                ? "Sent!"
                : "Send message"}
            </button>

            {/* Success Message */}
            {status === "sent" && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400"
              >
                Thanks — we'll be in touch soon.
              </motion.p>
            )}

          </motion.form>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- */
/* Contact Information Card */
/* -------------------------------- */

function InfoCard({ icon, label, value, color }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:bg-white/[0.06]">

      <span
        className="grid size-11 shrink-0 place-items-center rounded-full border"
        style={{
          borderColor: color,
          color: color,
        }}
      >
        {icon}
      </span>

      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
          {label}
        </p>

        <p className="mt-0.5 text-sm text-white">
          {value}
        </p>
      </div>

    </div>
  );
}