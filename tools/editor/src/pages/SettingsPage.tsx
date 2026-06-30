const page: React.CSSProperties = { padding: 24, maxWidth: 480 };

export function SettingsPage() {
  return (
    <div style={page}>
      <h1 style={{ marginTop: 0 }}>Settings</h1>
      <p style={{ color: '#888' }}>
        Editor preferences — strict validation toggle and more coming soon.
      </p>
    </div>
  );
}
