import { NavLink, Outlet } from 'react-router-dom';
import { NAV_ITEMS } from './nav';

const shell: React.CSSProperties = {
  display: 'flex',
  minHeight: '100vh',
};

const sidebar: React.CSSProperties = {
  width: 200,
  background: '#12121a',
  borderRight: '1px solid #2a2a35',
  padding: '16px 0',
  flexShrink: 0,
};

const brand: React.CSSProperties = {
  padding: '0 16px 16px',
  fontWeight: 700,
  fontSize: 18,
  color: '#f0c674',
};

const link: React.CSSProperties = {
  display: 'block',
  padding: '8px 16px',
  color: '#b0b0b8',
  textDecoration: 'none',
  fontSize: 14,
};

const main: React.CSSProperties = {
  flex: 1,
  overflow: 'auto',
};

export function AppShell() {
  return (
    <div style={shell}>
      <aside style={sidebar}>
        <div style={brand}>Dawn Studio</div>
        <nav>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                ...link,
                background: isActive ? '#252530' : undefined,
                color: isActive ? '#fff' : item.placeholder ? '#666' : '#b0b0b8',
              })}
            >
              {item.label}
              {item.placeholder ? ' ·' : ''}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main style={main}>
        <Outlet />
      </main>
    </div>
  );
}
