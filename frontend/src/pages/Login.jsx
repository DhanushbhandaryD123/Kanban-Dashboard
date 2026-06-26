import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import AuthLayout from "./AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setErr(""); setBusy(true);
    try { await login(form); navigate("/"); }
    catch (e) { setErr(e.response?.data?.message || "Could not sign in. Is the API running?"); }
    finally { setBusy(false); }
  };

  return (
    <AuthLayout heading="Welcome back" sub="Sign in to pick up where you left off.">
      <div className="space-y-3">
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
          <input className="input pl-10" placeholder="you@company.com" type="email"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
          <input className="input pl-10" placeholder="Password" type="password"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && submit()} />
        </div>

        <div className="flex justify-between items-center text-xs">
          <label className="flex items-center gap-2 text-muted">
            <input type="checkbox" className="accent-accent" /> Remember me
          </label>
          <Link to="/forgot-password" className="text-accent-soft hover:underline">Forgot password?</Link>
        </div>

        {err && <p className="text-xs text-danger bg-danger/10 rounded-lg px-3 py-2">{err}</p>}

        <button onClick={submit} disabled={busy} className="btn-primary w-full">
          {busy ? "Signing in…" : <>Sign in <ArrowRight size={16} /></>}
        </button>
        <button onClick={() => { loginDemo(); navigate("/"); }} className="btn-ghost w-full border border-line">
          View live demo
        </button>
      </div>

      <p className="text-sm text-muted text-center mt-6">
        New here? <Link to="/register" className="text-accent-soft font-semibold hover:underline">Create an account</Link>
      </p>
      
    </AuthLayout>
  );
}
