export function ValidationMessage({ message }: { message: string }) {
  return <span style={{ fontSize: 12, color: '#e6a23c', marginTop: 2 }}>⚠ {message}</span>;
}
