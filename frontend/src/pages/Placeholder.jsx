import { Inbox } from "lucide-react";
import Topbar from "../components/layout/Topbar";

export default function Placeholder({ title }) {
  return (
    <>
      <Topbar title={title} />
      <div className="grid place-items-center h-[70vh] px-6">
        <div className="text-center max-w-sm">
          <div className="grid place-items-center w-16 h-16 rounded-2xl bg-elevated border border-line mx-auto mb-5">
            <Inbox size={26} className="text-muted" />
          </div>
          <h2 className="font-display text-xl font-bold">Nothing here yet</h2>
          <p className="text-sm text-muted mt-2">When you {title.toLowerCase()} boards or tasks, they'll show up in this space.</p>
        </div>
      </div>
    </>
  );
}
