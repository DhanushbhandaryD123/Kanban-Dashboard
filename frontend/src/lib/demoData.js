// Used as a graceful fallback so the UI renders even before MongoDB is connected.
export const demoColumns = [
  { _id: "c1", title: "To Do",       accent: "#6366F1", order: 0 },
  { _id: "c2", title: "In Progress", accent: "#F59E0B", order: 1 },
  { _id: "c3", title: "Review",      accent: "#A855F7", order: 2 },
  { _id: "c4", title: "Done",        accent: "#22C55E", order: 3 },
];

export const demoTasks = [
  { _id: "t1", title: "Design onboarding flow",      column: "c1", order: 0, priority: "high",
    labels: [{ name: "Design", color: "#A855F7" }], dueDate: new Date(Date.now() + 3 * 864e5),
    assignees: [{ name: "Aarav Shetty" }], checklist: [{ done: true }, { done: false }, { done: false }] },
  { _id: "t2", title: "Set up CI/CD pipeline",       column: "c1", order: 1, priority: "medium",
    labels: [{ name: "DevOps", color: "#22C55E" }], assignees: [{ name: "Karthik Nayak" }] },
  { _id: "t3", title: "Research competitor pricing", column: "c1", order: 2, priority: "low",
    assignees: [{ name: "Meera Rao" }], commentsCount: 2 },
  { _id: "t4", title: "Build auth service",          column: "c2", order: 0, priority: "urgent",
    labels: [{ name: "Backend", color: "#6366F1" }], dueDate: new Date(Date.now() + 864e5),
    assignees: [{ name: "You" }, { name: "Meera Rao" }], estimateHours: 12, loggedHours: 7,
    checklist: [{ done: true }, { done: false }], commentsCount: 5 },
  { _id: "t5", title: "Marketing landing page",      column: "c2", order: 1, priority: "low",
    coverImage: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=70",
    assignees: [{ name: "Riya Pai" }], attachments: [{ name: "hero.png" }] },
  { _id: "t6", title: "Security & penetration review", column: "c3", order: 0, priority: "high",
    assignees: [{ name: "Karthik Nayak" }], commentsCount: 4, estimateHours: 8, loggedHours: 3 },
  { _id: "t7", title: "Database schema design",      column: "c4", order: 0, priority: "medium",
    assignees: [{ name: "You" }], checklist: [{ done: true }, { done: true }] },
  { _id: "t8", title: "Brand guidelines v2",         column: "c4", order: 1, priority: "low",
    labels: [{ name: "Design", color: "#A855F7" }], assignees: [{ name: "Aarav Shetty" }] },
];

export const demoMembers = [
  { id: "m1", name: "You",           email: "demo@kanban.dev",    role: "owner" },
  { id: "m2", name: "Meera Rao",     email: "meera@kanban.dev",   role: "member" },
  { id: "m3", name: "Aarav Shetty",  email: "aarav@kanban.dev",   role: "member" },
  { id: "m4", name: "Karthik Nayak", email: "karthik@kanban.dev", role: "member" },
  { id: "m5", name: "Riya Pai",      email: "riya@kanban.dev",    role: "member" },
  { id: "m6", name: "Dev Kumar",     email: "dev@kanban.dev",     role: "member" },
  { id: "m7", name: "Priya Singh",   email: "priya@kanban.dev",   role: "member" },
];
