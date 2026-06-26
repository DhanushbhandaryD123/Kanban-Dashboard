import { Droppable } from "@hello-pangea/dnd";
import { Plus, MoreHorizontal } from "lucide-react";
import TaskCard from "./TaskCard";

export default function Column({ column, tasks, onAddTask, onOpenTask }) {
  const accent = column.accent || "#6366F1";
  return (
    <div className="w-[300px] shrink-0 flex flex-col max-h-full">
      <div className="flex items-center gap-2.5 px-1 mb-3">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: accent }} />
        <h3 className="font-bold text-sm">{column.title}</h3>
        <span className="text-xs font-semibold text-faint bg-elevated border border-line rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
        <div className="ml-auto flex items-center gap-0.5">
          <button onClick={() => onAddTask(column)} className="btn-ghost !p-1.5 rounded-lg"><Plus size={15} /></button>
          <button className="btn-ghost !p-1.5 rounded-lg"><MoreHorizontal size={15} /></button>
        </div>
      </div>

      <Droppable droppableId={column._id}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}
            className={`flex-1 overflow-y-auto rounded-xl2 p-2 transition-colors min-h-[120px]
              ${snapshot.isDraggingOver ? "bg-white/[.03]" : "bg-transparent"}`}
            style={snapshot.isDraggingOver ? { boxShadow: `inset 0 0 0 1.5px ${accent}55` } : {}}>
            {tasks.map((task, i) => (
              <TaskCard key={task._id} task={task} index={i} onClick={() => onOpenTask(task)} />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <button onClick={() => onAddTask(column)}
                className="w-full py-8 rounded-xl border border-dashed border-line text-faint text-sm hover:border-accent/40 hover:text-muted transition">
                + Add a task
              </button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
