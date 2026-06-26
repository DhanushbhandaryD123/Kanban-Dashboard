import Topbar from "../components/layout/Topbar";
import Avatar from "../components/ui/Avatar";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user } = useAuth();
  return (
    <>
      <Topbar title="Settings" subtitle="Manage your profile and workspace" />
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
            <div><label className="text-xs text-faint">Display name</label><input className="input mt-1.5" defaultValue={user?.name} /></div>
            <div><label className="text-xs text-faint">Role</label><input className="input mt-1.5 capitalize" defaultValue={user?.role} disabled /></div>
          </div>
          <button className="btn-primary mt-5">Save changes</button>
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
