import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User2, Mail, Lock, ArrowRight } from "lucide-react";
import AuthLayout from "./AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setErr(""); setBusy(true);
    try { await register(form); navigate("/login"); }
    catch (e) { setErr(e.response?.data?.message || "Could not create account. Is the API running?"); }
    finally { setBusy(false); }
  };

  return (
    <AuthLayout heading="Create your workspace" sub="Start organizing in under a minute.">
      <div className="space-y-3">
        <div className="relative">
          <User2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
          <input className="input pl-10" placeholder="Full name"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
          <input className="input pl-10" placeholder="you@company.com" type="email"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
          <input className="input pl-10" placeholder="Password (min 6 chars)" type="password"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && submit()} />
        </div>

        {err && <p className="text-xs text-danger bg-danger/10 rounded-lg px-3 py-2">{err}</p>}

        <button onClick={submit} disabled={busy} className="btn-primary w-full">
          {busy ? "Creating…" : <>Create account <ArrowRight size={16} /></>}
        </button>
      </div>
      <p className="text-sm text-muted text-center mt-6">
        Already have an account? <Link to="/login" className="text-accent-soft font-semibold hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
