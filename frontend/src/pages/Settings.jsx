import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Topbar from "../components/layout/Topbar";
import Avatar from "../components/ui/Avatar";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/userService";

export default function Settings() {
  const { user, updateUser } = useAuth();

  const [displayName, setDisplayName] = useState(user?.name || "");
  const [saving, setSaving]           = useState(false);
  const [toast, setToast]             = useState(null); // { type:"success"|"error", message }

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async () => {
    // ── Validation ──────────────────────────────────────────
    const trimmed = displayName.trim();
    if (!trimmed) {
      showToast("error", "Name cannot be empty.");
      return;
    }
    if (trimmed.length < 2) {
      showToast("error", "Name must be at least 2 characters.");
      return;
    }
    if (trimmed.length > 50) {
      showToast("error", "Name must be 50 characters or fewer.");
      return;
    }

    setSaving(true);
    const previousName = user?.name ?? "";

    // ── Demo mode: no token → update locally without API ────
    if (!localStorage.getItem("token")) {
      await new Promise((r) => setTimeout(r, 400));
      updateUser({ ...user, name: trimmed });
      setDisplayName(trimmed);
      setSaving(false);
      showToast("success", "Profile updated successfully");
      return;
    }

    // ── Real mode ────────────────────────────────────────────
    try {
      const { user: updatedUser } = await updateProfile(trimmed);
      updateUser(updatedUser);
      setDisplayName(updatedUser.name);
      showToast("success", "Profile updated successfully");
    } catch {
      setDisplayName(previousName);
      showToast("error", "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Topbar title="Settings" subtitle="Manage your profile and workspace" />

      {/* ── Toast ─────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-20 right-5 z-50 flex items-center gap-2.5 px-4 py-3
                        rounded-xl border text-sm font-medium shadow-soft
                        ${toast.type === "success"
                          ? "bg-success/10 border-success/30 text-success"
                          : "bg-danger/10  border-danger/30  text-danger"}`}
          >
            {toast.type === "success"
              ? <CheckCircle2 size={16} />
              : <AlertCircle  size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page content (unchanged layout) ───────────────── */}
      <div className="p-5 md:p-8 max-w-2xl space-y-5">
        <div className="card p-6">
          <h3 className="font-bold mb-4">Profile</h3>
          <div className="flex items-center gap-4 mb-5">
            <Avatar name={user?.name} src={user?.avatar} size={56} />
            <div>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-muted">{user?.email}</p>
            </div>
            <button className="btn-ghost border border-line ml-auto">Change</button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-faint">Display name</label>
              <input
                className="input mt-1.5"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                disabled={saving}
                maxLength={50}
              />
            </div>
            <div>
              <label className="text-xs text-faint">Role</label>
              <input className="input mt-1.5 capitalize" defaultValue={user?.role} disabled />
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary mt-5"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>

        <div className="card p-6">
          <h3 className="font-bold mb-4">Preferences</h3>
          {["Email notifications", "Desktop notifications", "Weekly digest"].map((p, i) => (
            <label key={p} className={`flex items-center justify-between py-3 ${i ? "border-t border-line" : ""}`}>
              <span className="text-sm">{p}</span>
              <input type="checkbox" defaultChecked={i < 2} className="accent-accent w-4 h-4" />
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
