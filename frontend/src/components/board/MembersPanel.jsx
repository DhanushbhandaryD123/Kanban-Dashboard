import { useState } from "react";
import { UserPlus } from "lucide-react";
import Modal from "../ui/Modal";
import Avatar from "../ui/Avatar";

export default function MembersPanel({ open, onClose, members, onAddMember }) {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAddMember(name.trim(), email.trim());
    setName("");
    setEmail("");
    setAdding(false);
  };

  return (
    <Modal open={open} onClose={onClose} title="Members" width={420}>
      <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-3">
            <Avatar name={m.name} size={36} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{m.name}</p>
              {m.email && <p className="text-xs text-muted truncate">{m.email}</p>}
            </div>
            <span className="chip bg-elevated text-faint capitalize">{m.role}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-line pt-4">
        {adding ? (
          <div className="space-y-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name *"
              className="input"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional)"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="input"
            />
            <div className="flex gap-2 justify-end pt-1">
              <button onClick={() => { setAdding(false); setName(""); setEmail(""); }} className="btn-ghost">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={!name.trim()} className="btn-primary">
                Add
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="btn-ghost w-full border border-dashed border-line"
          >
            <UserPlus size={15} /> Add member
          </button>
        )}
      </div>
    </Modal>
  );
}
