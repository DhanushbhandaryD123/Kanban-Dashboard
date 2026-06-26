import { Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { MessageSquare, Paperclip, Clock, CheckSquare, Calendar } from "lucide-react";
import Avatar from "../ui/Avatar";
import PriorityBadge from "../ui/Badge";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en", { month: "short", day: "numeric" });

const progressOf = (t) =>
  t.checklist?.length ? Math.round((t.checklist.filter((c) => c.done).length / t.checklist.length) * 100) : null;

export default function TaskCard({ task, index, onClick }) {
  const progress = progressOf(task);
  const dueSoon = task.dueDate && new Date(task.dueDate) - Date.now() < 2 * 864e5;

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
          style={provided.draggableProps.style}>
          <motion.div
            layout
            onClick={onClick}
            animate={{ scale: snapshot.isDragging ? 1.03 : 1, rotate: snapshot.isDragging ? -1.2 : 0 }}
            className={`group bg-elevated border rounded-xl2 p-3.5 cursor-pointer mb-2.5 transition-colors
              ${snapshot.isDragging ? "border-accent/60 shadow-glow" : "border-line hover:border-white/10"}`}
          >
            {task.coverImage && (
              <img src={task.coverImage} alt=""
                className="w-full h-24 object-cover rounded-lg mb-3" loading="lazy" />
            )}

            {task.labels?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {task.labels.map((l, i) => (
                  <span key={i} className="chip"
                    style={{ background: `${l.color}22`, color: l.color }}>{l.name}</span>
                ))}
              </div>
            )}

            <p className="text-sm font-semibold leading-snug mb-2.5 group-hover:text-accent-soft transition">
              {task.title}
            </p>

            {progress !== null && (
              <div className="mb-3">
                <div className="flex justify-between text-[11px] text-muted mb-1">
                  <span className="flex items-center gap-1"><CheckSquare size={11} />Checklist</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-bg overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-accent to-violet"
                    style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PriorityBadge level={task.priority} />
                {task.dueDate && (
                  <span className={`chip ${dueSoon ? "bg-danger/15 text-danger" : "text-faint"}`}>
                    <Calendar size={11} />{fmtDate(task.dueDate)}
                  </span>
                )}
              </div>
              <div className="flex -space-x-2">
                {(task.assignees || []).slice(0, 3).map((a) => (
                  <Avatar key={a._id || a.name} name={a.name} src={a.avatar} size={24} />
                ))}
              </div>
            </div>

            {(task.commentsCount > 0 || task.attachments?.length > 0 || task.estimateHours > 0) && (
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-line text-faint text-xs">
                {task.commentsCount > 0 && <span className="flex items-center gap-1"><MessageSquare size={13} />{task.commentsCount}</span>}
                {task.attachments?.length > 0 && <span className="flex items-center gap-1"><Paperclip size={13} />{task.attachments.length}</span>}
                {task.estimateHours > 0 && <span className="flex items-center gap-1"><Clock size={13} />{task.loggedHours}/{task.estimateHours}h</span>}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </Draggable>
  );
}
