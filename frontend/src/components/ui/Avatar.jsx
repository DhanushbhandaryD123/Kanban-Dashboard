const palette = ["#6366F1", "#A855F7", "#22C55E", "#F59E0B", "#EF4444", "#0EA5E9"];
const initials = (name = "?") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

export default function Avatar({ name, size = 28, src }) {
  const color = palette[(name?.charCodeAt(0) || 0) % palette.length];
  if (src)
    return (
      <img src={src} alt={name} style={{ width: size, height: size }}
        className="rounded-full object-cover ring-2 ring-bg" />
    );
  return (
    <div
      style={{ width: size, height: size, background: `${color}22`, color, fontSize: size * 0.36 }}
      className="rounded-full grid place-items-center font-bold ring-2 ring-bg select-none"
    >
      {initials(name)}
    </div>
  );
}
