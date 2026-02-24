const icons = {
  ChefHat: (fill) => (
    <g strokeWidth="2" stroke="currentColor" fill={fill}>
      <path d="M6 14v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-5" />
      <path d="M18 10a4 4 0 0 0-8 0 4 4 0 0 0-8 0 2 2 0 0 0 2 2 4 4 0 0 0 8 0 4 4 0 0 0 8 0 2 2 0 0 0 2-2z" />
    </g>
  ),
  Volume2: (
    <>
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
    </>
  ),
  VolumeX: (
    <>
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M23 9l-6 6M17 9l6 6" />
    </>
  ),
  Sliders: (
    <>
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
    </>
  ),
  X: <path d="M18 6L6 18M6 6l12 12" />,
  Play: <path d="m7 4 12 8-12 8V4z" />,
  Pause: (
    <>
      <path d="M6 4h4v16H6z" />
      <path d="M14 4h4v16h-4z" />
    </>
  ),
  Hand: <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v11M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />,
  Timer: (
    <>
      <path d="M10 2h4" />
      <path d="M12 14l3-3" />
      <circle cx="12" cy="14" r="8" />
    </>
  ),
  Clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  Egg: (
    <ellipse cx="12" cy="13" rx="6" ry="8" strokeWidth="2" stroke="currentColor" fill="none" />
  ),
  Potato: (
    <ellipse cx="12" cy="12" rx="7" ry="6" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" />
  ),
  Beef: (
    <path d="M4 12h16c0-4-2-8-6-8S4 8 4 12z" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" />
  ),
  Pancake: (
    <circle cx="12" cy="12" r="8" strokeWidth="2" stroke="currentColor" fill="none" />
  ),
};

export const SVGIcon = ({ name, size = 24, className = "", fill = "none" }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={fill === "currentColor" ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {typeof icons[name] === 'function' ? icons[name](fill) : (icons[name] ?? null)}
    </svg>
  );
};
