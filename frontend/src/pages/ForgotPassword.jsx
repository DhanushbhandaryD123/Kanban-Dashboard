import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import AuthLayout from "./AuthLayout";
import api from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try { await api.post("/auth/forgot-password", { email }); } catch { /* show success regardless */ }
    finally { setSent(true); setBusy(false); }
  };

  return (
    <AuthLayout heading="Reset your password" sub="We'll send a reset link to your inbox.">
      {sent ? (
        <div className="card p-5 text-center">
          <CheckCircle2 size={36} className="text-success mx-auto mb-3" />
          <p className="text-sm">If an account exists for <span className="text-ink font-semibold">{email}</span>, a reset link is on its way.</p>
          <Link to="/login" className="btn-ghost w-full border border-line mt-4 justify-center"><ArrowLeft size={15} />Back to sign in</Link>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
            <input className="input pl-10" placeholder="you@company.com" type="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()} />
          </div>
          <button onClick={submit} disabled={busy || !email} className="btn-primary w-full">
            {busy ? "Sending…" : "Send reset link"}
          </button>
          <Link to="/login" className="btn-ghost w-full justify-center"><ArrowLeft size={15} />Back to sign in</Link>
        </div>
      )}
    </AuthLayout>
  );
}
