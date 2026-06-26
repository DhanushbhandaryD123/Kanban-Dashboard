import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droppable } from "@hello-pangea/dnd";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import TaskCard from "./TaskCard";

export default function Column({ column, tasks, onAddTask, onOpenTask, onEditColumn, onDeleteColumn }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const accent = column.accent || "#6366F1";

  const close = () => setMenuOpen(false);

  return (
    <div className="w-[300px] shrink-0 flex flex-col max-h-full">
      {/* Column header */}
      <div className="flex items-center gap-2.5 px-1 mb-3">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: accent }} />
        <h3 className="font-bold text-sm">{column.title}</h3>
        <span className="text-xs font-semibold text-faint bg-elevated border border-line rounded-full px-2 py-0.5">
          {tasks.length}
        </span>

        <div className="ml-auto flex items-center gap-0.5">
          <button onClick={() => onAddTask(column)} className="btn-ghost !p-1.5 rounded-lg">
            <Plus size={15} />
          </button>

          {/* Three-dot menu */}
          <div className="relative">
            <button onClick={() => setMenuOpen(v => !v)} className="btn-ghost !p-1.5 rounded-lg">
              <MoreHorizontal size={15} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <>
                  {/* Backdrop to close on outside click */}
                  <div className="fixed inset-0 z-40" onClick={close} />

                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0,  scale: 1    }}
                    exit={{   opacity: 0, y: -4, scale: 0.96 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-8 z-50 w-36 card p-1 shadow-soft"
                  >
                    <button
                      onClick={() => { close(); onEditColumn(column); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-muted hover:text-ink hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      onClick={() => { close(); onDeleteColumn(column); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-danger hover:bg-danger/10"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Droppable task list */}
      <Droppable droppableId={column._id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto rounded-xl2 p-2 transition-colors min-h-[120px]
              ${snapshot.isDraggingOver ? "bg-ink/[.04]" : "bg-transparent"}`}
            style={snapshot.isDraggingOver ? { boxShadow: `inset 0 0 0 1.5px ${accent}55` } : {}}
          >
            {tasks.map((task, i) => (
              <TaskCard key={task._id} task={task} index={i} onClick={() => onOpenTask(task)} />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <button
                onClick={() => onAddTask(column)}
                className="w-full py-8 rounded-xl border border-dashed border-line text-faint text-sm
                           hover:border-accent/40 hover:text-muted transition"
              >
                + Add a task
              </button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
