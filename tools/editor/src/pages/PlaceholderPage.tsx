const page: React.CSSProperties = { padding: 24 };

export function PlaceholderPage({
  title,
  description = 'Coming in a future sprint.',
}: {
  title: string;
  description?: string;
}) {
  return (
    <div style={page}>
      <h1 style={{ marginTop: 0 }}>{title}</h1>
      <p style={{ color: '#888' }}>{description}</p>
    </div>
  );
}
