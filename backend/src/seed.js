import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { User } from "./models/User.js";
import { Board } from "./models/Board.js";
import { Column } from "./models/Column.js";
import { Task } from "./models/Task.js";

dotenv.config();

const run = async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany({}), Board.deleteMany({}), Column.deleteMany({}), Task.deleteMany({}),
  ]);

  const owner = await User.create({
    name: "Dhanush Bhandary", email: "demo@kanban.dev", password: "demo123", role: "owner",
  });
  const teammates = await User.insertMany([
    { name: "Aarav Shetty", email: "aarav@kanban.dev", password: "demo123", role: "member" },
    { name: "Meera Rao", email: "meera@kanban.dev", password: "demo123", role: "admin" },
    { name: "Karthik Nayak", email: "karthik@kanban.dev", password: "demo123", role: "member" },
  ]);

  const board = await Board.create({
    title: "Product Launch", description: "Q3 coastal rollout", color: "#6366F1",
    owner: owner._id, members: [owner._id, ...teammates.map((t) => t._id)],
  });

  const cols = await Column.insertMany([
    { title: "To Do", board: board._id, accent: "#6366F1", order: 0 },
    { title: "In Progress", board: board._id, accent: "#F59E0B", order: 1 },
    { title: "Review", board: board._id, accent: "#A855F7", order: 2 },
    { title: "Done", board: board._id, accent: "#22C55E", order: 3 },
  ]);

  const byTitle = Object.fromEntries(cols.map((c) => [c.title, c._id]));
  const ids = [owner._id, ...teammates.map((t) => t._id)];

  await Task.insertMany([
    { title: "Design onboarding flow", board: board._id, column: byTitle["To Do"], order: 0,
      priority: "high", assignees: [ids[1]], dueDate: new Date(Date.now() + 3 * 864e5),
      labels: [{ name: "Design", color: "#A855F7" }],
      checklist: [{ text: "Wireframes", done: true }, { text: "Prototype", done: false }] },
    { title: "Set up CI pipeline", board: board._id, column: byTitle["To Do"], order: 1,
      priority: "medium", assignees: [ids[3]], labels: [{ name: "DevOps", color: "#22C55E" }] },
    { title: "Build auth service", board: board._id, column: byTitle["In Progress"], order: 0,
      priority: "urgent", assignees: [ids[0], ids[2]], estimateHours: 12, loggedHours: 7,
      dueDate: new Date(Date.now() + 1 * 864e5), labels: [{ name: "Backend", color: "#6366F1" }],
      checklist: [{ text: "JWT", done: true }, { text: "Refresh tokens", done: false }] },
    { title: "Marketing landing page", board: board._id, column: byTitle["In Progress"], order: 1,
      priority: "low", assignees: [ids[1]],
      coverImage: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=70" },
    { title: "Security review", board: board._id, column: byTitle["Review"], order: 0,
      priority: "high", assignees: [ids[2]], commentsCount: 4 },
    { title: "Database schema", board: board._id, column: byTitle["Done"], order: 0,
      priority: "medium", assignees: [ids[0]],
      checklist: [{ text: "Users", done: true }, { text: "Tasks", done: true }] },
    { title: "Brand guidelines", board: board._id, column: byTitle["Done"], order: 1,
      priority: "low", assignees: [ids[1]] },
  ]);

  console.log("Seeded. Login: demo@kanban.dev / demo123");
  process.exit(0);
};

run().catch((e) => { console.error(e); process.exit(1); });
