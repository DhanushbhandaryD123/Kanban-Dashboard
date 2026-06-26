import { motion } from "framer-motion";
import { Hexagon } from "lucide-react";

export default function AuthLayout({ children, heading, sub }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-line">
        <div className="absolute inset-0 -z-10"
          style={{ background: "radial-gradient(600px 400px at 30% 20%, rgba(99,102,241,.25), transparent 60%), radial-gradient(500px 400px at 80% 90%, rgba(168,85,247,.18), transparent 60%)" }} />
        <div className="flex items-center gap-2.5">
          <div className="grid place-items-center w-10 h-10 rounded-xl bg-accent shadow-glow">
            <Hexagon size={20} className="text-white" fill="white" />
          </div>
          <span className="font-display font-extrabold text-xl">Flux</span>
        </div>

        <div>
          <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold leading-tight max-w-md">
            Where coastal teams ship their best work.
          </motion.h2>
          <p className="text-muted mt-4 max-w-sm">
            Boards, deadlines, and real-time flow — designed to feel calm under pressure.
          </p>
          <div className="flex -space-x-2 mt-6">
            {["#6366F1", "#A855F7", "#22C55E", "#F59E0B"].map((c, i) => (
              <div key={i} className="w-9 h-9 rounded-full ring-2 ring-bg" style={{ background: c }} />
            ))}
            <div className="grid place-items-center w-9 h-9 rounded-full bg-elevated border border-line text-xs text-muted ring-2 ring-bg">9+</div>
          </div>
        </div>

        <p className="text-xs text-faint">© 2026 Flux. Built for makers.</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="grid place-items-center w-9 h-9 rounded-xl bg-accent"><Hexagon size={18} className="text-white" fill="white" /></div>
            <span className="font-display font-extrabold text-lg">Flux</span>
          </div>
          <h1 className="font-display text-2xl font-bold">{heading}</h1>
          <p className="text-sm text-muted mt-1.5 mb-7">{sub}</p>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
