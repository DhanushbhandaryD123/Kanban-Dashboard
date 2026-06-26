import { useEffect, useState } from "react";
import { Filter, SlidersHorizontal, Users, RotateCcw } from "lucide-react";
import Topbar from "../components/layout/Topbar";
import Board from "../components/board/Board";
import Modal from "../components/ui/Modal";
import MembersPanel from "../components/board/MembersPanel";
import Avatar from "../components/ui/Avatar";
import api from "../lib/api";
import { demoColumns, demoTasks, demoMembers } from "../lib/demoData";

// ─── localStorage keys ───────────────────────────────────────────────────────
const DEMO_KEY  = "kanban_demo_state";
const NOTIF_KEY = "kanban_notifications";

// ─── localStorage helpers ────────────────────────────────────────────────────
const saveDemoState = (cols, tsks, mems) => {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify({ columns: cols, tasks: tsks, members: mems }));
  } catch { /* private-browsing quota — silently skip */ }
};

const loadDemoState = () => {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
};

const loadNotifications = () => {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch { return []; }
};

const saveNotifications = (ns) => {
  try {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(ns.slice(0, 50)));
  } catch {}
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function BoardPage() {
  const [columns,    setColumns]    = useState([]);
  const [tasks,      setTasks]      = useState([]);
  const [members,    setMembers]    = useState([]);
  const [boardTitle, setBoardTitle] = useState("Product Launch");
  const [loading,    setLoading]    = useState(true);
  const [usingDemo,  setUsingDemo]  = useState(false);
  const [boardId,    setBoardId]    = useState(null);

  // Notification state: initialise immediately from localStorage
  const [notifications, setNotifications] = useState(loadNotifications);

  // Modal / panel state
  const [addOpen,       setAddOpen]       = useState(false);
  const [addColumn,     setAddColumn]     = useState(null);
  const [newTitle,      setNewTitle]      = useState("");
  const [openTask,      setOpenTask]      = useState(null);
  const [membersOpen,   setMembersOpen]   = useState(false);
  const [editColOpen,   setEditColOpen]   = useState(false);
  const [editColTarget, setEditColTarget] = useState(null);
  const [editColTitle,  setEditColTitle]  = useState("");

  // ── Initial board load ────────────────────────────────────────────────────
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
        setMembers(
          data.board.members?.length
            ? data.board.members.map((m, i) => ({ id: m._id || `real-${i}`, name: m.name || m, email: m.email || "", role: "member" }))
            : []
        );
      } catch (error) {
        console.error("Board Load Error:", error);
        if (!active) return;
        const saved = loadDemoState();
        if (saved) {
          setColumns(saved.columns);
          setTasks(saved.tasks);
          setMembers(saved.members?.length ? saved.members : demoMembers);
        } else {
          setColumns(demoColumns);
          setTasks(demoTasks);
          setMembers(demoMembers);
          saveDemoState(demoColumns, demoTasks, demoMembers);
        }
        setUsingDemo(true);
      } finally {
        active && setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  // ── Listen for new-board events dispatched by Sidebar (demo mode) ─────────
  useEffect(() => {
    const handler = (e) => {
      const { board, columns: newCols, tasks: newTasks, members: newMems } = e.detail;
      setBoardTitle(board.title);
      setBoardId(null);
      setColumns(newCols);
      setTasks(newTasks);
      setMembers(newMems);
      setUsingDemo(true);
      setLoading(false);
    };
    window.addEventListener("demo:board:switch", handler);
    return () => window.removeEventListener("demo:board:switch", handler);
  }, []);

  // ── Notification helpers ──────────────────────────────────────────────────
  const pushNotification = (text) => {
    const n = { id: crypto.randomUUID(), text, time: Date.now(), read: false };
    setNotifications(prev => {
      const next = [n, ...prev].slice(0, 50);
      saveNotifications(next);
      return next;
    });
  };

  const markNotifsRead = () => {
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, read: true }));
      saveNotifications(next);
      return next;
    });
  };

  // ── Drag-and-drop ─────────────────────────────────────────────────────────
  const handleMove = async (payload) => {
    if (usingDemo) {
      const { toColumn, orderedIds } = payload;
      setTasks((prev) => {
        const newTasks = prev.map((t) => {
          const newOrder = orderedIds.indexOf(t._id);
          if (newOrder !== -1) return { ...t, column: toColumn, order: newOrder };
          return t;
        });
        saveDemoState(columns, newTasks, members);
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

  // ── Board reload (real mode) ──────────────────────────────────────────────
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

  // ── Add task ──────────────────────────────────────────────────────────────
  const submitTask = async () => {
    if (!newTitle.trim()) return;

    if (usingDemo) {
      const newTask = {
        _id: crypto.randomUUID(),
        title: newTitle.trim(),
        column: addColumn._id,
        order: tasks.filter((t) => (t.column?._id || t.column) === addColumn._id).length,
        priority: "medium",
        labels: [],
        assignees: [],
      };
      const newTasks = [...tasks, newTask];
      setTasks(newTasks);
      saveDemoState(columns, newTasks, members);
      pushNotification(`Task "${newTask.title}" added to ${addColumn.title}`);
      setNewTitle("");
      setAddOpen(false);
      return;
    }

    try {
      await api.post("/tasks", {
        title: newTitle.trim(),
        board: boardId,
        column: addColumn._id,
        priority: "medium",
      });
      pushNotification(`Task "${newTitle.trim()}" added to ${addColumn.title}`);
      setNewTitle("");
      setAddOpen(false);
      await reloadBoard();
    } catch (error) {
      console.error("Create Task Error:", error);
    }
  };

  // ── Members ───────────────────────────────────────────────────────────────
  const handleAddMember = async (name, email) => {
    const newMember = { id: crypto.randomUUID(), name, email, role: "member" };

    if (usingDemo) {
      const newMembers = [...members, newMember];
      setMembers(newMembers);
      saveDemoState(columns, tasks, newMembers);
      pushNotification(`${name} added as a member`);
      return;
    }

    try {
      // Real mode: send updated members array to API
      const payload = [...members, newMember];
      await api.patch(`/boards/${boardId}`, { members: payload });
      setMembers(payload);
      pushNotification(`${name} added as a member`);
    } catch (e) {
      console.error("Add member failed:", e);
    }
  };

  // ── Column edit ───────────────────────────────────────────────────────────
  const handleEditColumn = (col) => {
    setEditColTarget(col);
    setEditColTitle(col.title);
    setEditColOpen(true);
  };

  const submitEditColumn = async () => {
    if (!editColTitle.trim() || !editColTarget) return;
    const newTitle = editColTitle.trim();

    if (usingDemo) {
      const newCols = columns.map(c =>
        c._id === editColTarget._id ? { ...c, title: newTitle } : c
      );
      setColumns(newCols);
      saveDemoState(newCols, tasks, members);
      pushNotification(`Column renamed to "${newTitle}"`);
      setEditColOpen(false);
      return;
    }

    try {
      await api.patch(`/columns/${editColTarget._id}`, { title: newTitle });
      await reloadBoard();
      pushNotification(`Column renamed to "${newTitle}"`);
      setEditColOpen(false);
    } catch (e) {
      console.error("Edit column failed:", e);
    }
  };

  // ── Column delete ─────────────────────────────────────────────────────────
  const handleDeleteColumn = async (col) => {
    if (!window.confirm(`Delete column "${col.title}" and all its tasks? This cannot be undone.`)) return;

    if (usingDemo) {
      const newCols  = columns.filter(c => c._id !== col._id);
      const newTasks = tasks.filter(t => (t.column?._id || t.column) !== col._id);
      setColumns(newCols);
      setTasks(newTasks);
      saveDemoState(newCols, newTasks, members);
      pushNotification(`Column "${col.title}" deleted`);
      return;
    }

    try {
      await api.delete(`/columns/${col._id}`);
      await reloadBoard();
      pushNotification(`Column "${col.title}" deleted`);
    } catch (e) {
      console.error("Delete column failed:", e);
    }
  };

  // ── Reset demo ────────────────────────────────────────────────────────────
  const resetDemo = () => {
    localStorage.removeItem(DEMO_KEY);
    setColumns(demoColumns);
    setTasks(demoTasks);
    setMembers(demoMembers);
    saveDemoState(demoColumns, demoTasks, demoMembers);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <Topbar
        title={boardTitle}
        subtitle={usingDemo ? "Demo data · connect MongoDB to persist" : "4 columns · live"}
        notifications={notifications}
        onNotifsRead={markNotifsRead}
      />

      {/* Board toolbar */}
      <div className="px-5 md:px-8 py-4 flex items-center gap-2 flex-wrap">
        <button className="btn-ghost border border-line"><Filter size={15} />Filter</button>
        <button className="btn-ghost border border-line"><SlidersHorizontal size={15} />Sort</button>
        <button onClick={() => setMembersOpen(true)} className="btn-ghost border border-line">
          <Users size={15} />Members
        </button>
        {usingDemo && (
          <button onClick={resetDemo} className="btn-ghost border border-line text-muted">
            <RotateCcw size={15} />Reset demo
          </button>
        )}

        {/* Avatar stack — also opens Members panel */}
        <div
          className="ml-auto flex -space-x-2 cursor-pointer"
          onClick={() => setMembersOpen(true)}
          title="View members"
        >
          {members.slice(0, 4).map((m) => (
            <Avatar key={m.id} name={m.name} size={30} />
          ))}
          {members.length > 4 && (
            <span className="grid place-items-center w-[30px] h-[30px] rounded-full bg-elevated border border-line text-[11px] text-muted ring-2 ring-bg">
              +{members.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Kanban board */}
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
          <Board
            columns={columns}
            tasks={tasks}
            setTasks={setTasks}
            onMove={handleMove}
            onAddTask={(col) => { setAddColumn(col); setAddOpen(true); }}
            onOpenTask={setOpenTask}
            onEditColumn={handleEditColumn}
            onDeleteColumn={handleDeleteColumn}
          />
        )}
      </div>

      {/* ── Members panel ── */}
      <MembersPanel
        open={membersOpen}
        onClose={() => setMembersOpen(false)}
        members={members}
        onAddMember={handleAddMember}
      />

      {/* ── Add task modal ── */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={`Add task to ${addColumn?.title || ""}`}>
        <input
          autoFocus
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitTask()}
          placeholder="What needs to be done?"
          className="input mb-4"
        />
        <div className="flex gap-2 justify-end">
          <button onClick={() => setAddOpen(false)} className="btn-ghost">Cancel</button>
          <button onClick={submitTask} className="btn-primary">Add task</button>
        </div>
      </Modal>

      {/* ── Edit column modal ── */}
      <Modal open={editColOpen} onClose={() => setEditColOpen(false)} title="Rename column">
        <input
          autoFocus
          value={editColTitle}
          onChange={(e) => setEditColTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitEditColumn()}
          placeholder="Column name"
          className="input mb-4"
        />
        <div className="flex gap-2 justify-end">
          <button onClick={() => setEditColOpen(false)} className="btn-ghost">Cancel</button>
          <button onClick={submitEditColumn} className="btn-primary">Save</button>
        </div>
      </Modal>

      {/* ── Task detail modal ── */}
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
                  {(openTask.assignees || []).map((a) => <Avatar key={a.name || a} name={a.name || a} size={28} />)}
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
