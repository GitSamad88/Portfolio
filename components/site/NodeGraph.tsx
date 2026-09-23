export default function NodeGraph() {
  const inputs = [
    { x: 40, y: 70 },
    { x: 40, y: 200 },
    { x: 40, y: 330 },
  ];
  const hub = { x: 300, y: 200 };
  const outputs = [
    { x: 560, y: 120 },
    { x: 560, y: 280 },
  ];

  const edge = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const midX = (a.x + b.x) / 2;
    return `M ${a.x} ${a.y} C ${midX} ${a.y}, ${midX} ${b.y}, ${b.x} ${b.y}`;
  };

  return (
    <svg
      viewBox="0 0 600 400"
      className="h-full w-full"
      role="img"
      aria-label="Diagram of data flowing from multiple input nodes through a central automation hub to output nodes"
    >
      {inputs.map((n, i) => (
        <path
          key={`in-${i}`}
          d={edge(n, hub)}
          fill="none"
          stroke="var(--color-muted)"
          strokeOpacity={0.5}
          strokeWidth={1.5}
          className="flow-line"
        />
      ))}
      {outputs.map((n, i) => (
        <path
          key={`out-${i}`}
          d={edge(hub, n)}
          fill="none"
          stroke="var(--color-secondary)"
          strokeOpacity={0.6}
          strokeWidth={1.5}
          className="flow-line"
        />
      ))}

      {inputs.map((n, i) => (
        <circle key={`in-node-${i}`} cx={n.x} cy={n.y} r={4} fill="var(--color-muted)" />
      ))}

      <circle cx={hub.x} cy={hub.y} r={9} fill="var(--color-bg)" stroke="var(--color-primary)" strokeWidth={2} />
      <circle cx={hub.x} cy={hub.y} r={4} fill="var(--color-primary)" className="pulse-node" />

      {outputs.map((n, i) => (
        <circle key={`out-node-${i}`} cx={n.x} cy={n.y} r={5} fill="var(--color-secondary)" />
      ))}
    </svg>
  );
}
