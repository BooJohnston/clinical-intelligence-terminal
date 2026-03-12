import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <div className="disclaimer-banner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          For clinical reference, evidence review, and care-planning support only. Not a substitute for clinician judgment.
        </div>
        <TopBar />
        <main className="page fade-in">{children}</main>
      </div>
    </div>
  );
}
