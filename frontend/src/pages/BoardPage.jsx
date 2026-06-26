import { useEffect, useState } from "react";
import { Filter, SlidersHorizontal, Users, RotateCcw } from "lucide-react";
import Topbar from "../components/layout/Topbar";
import Board from "../components/board/Board";
import Modal from "../components/ui/Modal";
import Avatar from "../components/ui/Avatar";
import api from "../lib/api";
import { demoColumns, demoTasks } from "../lib/demoData";

const DEMO_KEY = "kanban_demo_state";

const saveDemoState = (cols, tsks) => {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify({ columns: cols, tasks: tsks }));
  } catch {
    // localStorage unavailable (private browsing quota, etc.) — silently skip
  }
};

const loadDemoState = () => {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export default function BoardPage() {
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [boardTitle, setBoardTitle] = useState("Product Launch");
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [boardId, setBoardId] = useState(null);

  const [addOpen, setAddOpen] = useState(false);
  const [addColumn, setAddColumn] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [openTask, setOpenTask] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const { data: boards } = await api.get("/boards");
        if (!boards?.length) throw new Error("no boards");
        const { data } = await api.get(`/boards/${boards[0]._id}`);
        if (!active) return;
        setBoardTitle(data.board.title);
        setBoardId(data.board._id);
        setColumns(data.columns);
        setTasks(data.tasks);
      } catch (error) {
        console.error("Board Load Error:", error);
        if (!active) return;

        const saved = loadDemoState();
        if (saved) {
          setColumns(saved.columns);
          setTasks(saved.tasks);
        } else {
          setColumns(demoColumns);
          setTasks(demoTasks);
          saveDemoState(demoColumns, demoTasks);
        }
        setUsingDemo(true);
      } finally {
        active && setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const handleMove = async (payload) => {
    if (usingDemo) {
      // Board.jsx already applied the move to React state optimistically.
      // Reconstruct the post-move tasks array to write to localStorage.
      const { toColumn, orderedIds } = payload;
      setTasks((prev) => {
        const newTasks = prev.map((t) => {
          const newOrder = orderedIds.indexOf(t._id);
          if (newOrder !== -1) return { ...t, column: toColumn, order: newOrder };
          return t;
        });
        saveDemoState(columns, newTasks);
        return newTasks;
      });
      return;
    }
    try {
      await api.patch("/tasks/move", payload);
      await reloadBoard();
    } catch (error) {
      console.error(error);
    }
  };

  const reloadBoard = async () => {
    try {
      const { data: boards } = await api.get("/boards");
      if (!boards.length) return;
      const { data } = await api.get(`/boards/${boards[0]._id}`);
      setBoardTitle(data.board.title);
      setBoardId(data.board._id);
      setColumns(data.columns);
      setTasks(data.tasks);
    } catch (error) {
      console.error(error);
    }
  };

  const submitTask = async () => {
    if (!newTitle.trim()) return;

    if (usingDemo) {
      const newTask = {
        _id: crypto.randomUUID(),
        title: newTitle,
        column: addColumn._id,
        order: tasks.filter((t) => t.column === addColumn._id).length,
        priority: "medium",
        labels: [],
        assignees: [],
      };
      const newTasks = [...tasks, newTask];
      setTasks(newTasks);
      saveDemoState(columns, newTasks);
      setNewTitle("");
      setAddOpen(false);
      return;
    }

    try {
      await api.post("/tasks", {
        title: newTitle,
        board: boardId,
        column: addColumn._id,
        priority: "medium",
      });
      setNewTitle("");
      setAddOpen(false);
      await reloadBoard();
    } catch (error) {
      console.error("Create Task Error:", error);
    }
  };

  const resetDemo = () => {
    localStorage.removeItem(DEMO_KEY);
    setColumns(demoColumns);
    setTasks(demoTasks);
    saveDemoState(demoColumns, demoTasks);
  };

  return (
    <>
      <Topbar title={boardTitle} subtitle={usingDemo ? "Demo data · connect MongoDB to persist" : "4 columns · live"} />

      <div className="px-5 md:px-8 py-4 flex items-center gap-2 flex-wrap">
        <button className="btn-ghost border border-line"><Filter size={15} />Filter</button>
        <button className="btn-ghost border border-line"><SlidersHorizontal size={15} />Sort</button>
        <button className="btn-ghost border border-line"><Users size={15} />Members</button>
        {usingDemo && (
          <button onClick={resetDemo} className="btn-ghost border border-line text-muted">
            <RotateCcw size={15} />Reset demo
          </button>
        )}
        <div className="ml-auto flex -space-x-2">
          {["You", "Meera Rao", "Aarav Shetty", "Karthik Nayak"].map((n) => (
            <Avatar key={n} name={n} size={30} />
          ))}
          <span className="grid place-items-center w-[30px] h-[30px] rounded-full bg-elevated border border-line text-[11px] text-muted ring-2 ring-bg">+3</span>
        </div>
      </div>

      <div className="h-[calc(100vh-9rem)]">
        {loading ? (
          <div className="flex gap-5 px-5 md:px-8">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-[300px] space-y-2.5">
                <div className="skeleton h-7 w-32" />
                {[0, 1, 2].map((j) => <div key={j} className="skeleton h-28" />)}
              </div>
            ))}
          </div>
        ) : (
          <Board columns={columns} tasks={tasks} setTasks={setTasks} onMove={handleMove}
            onAddTask={(col) => { setAddColumn(col); setAddOpen(true); }}
            onOpenTask={setOpenTask} />
        )}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={`Add task to ${addColumn?.title || ""}`}>
        <input autoFocus value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitTask()}
          placeholder="What needs to be done?" className="input mb-4" />
        <div className="flex gap-2 justify-end">
          <button onClick={() => setAddOpen(false)} className="btn-ghost">Cancel</button>
          <button onClick={submitTask} className="btn-primary">Add task</button>
        </div>
      </Modal>

      <Modal open={!!openTask} onClose={() => setOpenTask(null)} title={openTask?.title} width={560}>
        {openTask && (
          <div className="space-y-4 text-sm">
            <div className="flex flex-wrap gap-2">
              {(openTask.labels || []).map((l, i) => (
                <span key={i} className="chip" style={{ background: `${l.color}22`, color: l.color }}>{l.name}</span>
              ))}
            </div>
            <p className="text-muted">{openTask.description || "No description yet. Click to add details, checklists, attachments and more."}</p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-xs text-faint mb-1.5">Assignees</p>
                <div className="flex -space-x-2">
                  {(openTask.assignees || []).map((a) => <Avatar key={a.name} name={a.name} size={28} />)}
                </div>
              </div>
              <div>
                <p className="text-xs text-faint mb-1.5">Priority</p>
                <p className="capitalize font-semibold">{openTask.priority}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
