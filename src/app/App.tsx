import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import AppShell from '../components/AppShell';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import QueryWorkspacePage from '../pages/QueryWorkspacePage';
import EvidencePage from '../pages/EvidencePage';
import PathwayExplorerPage from '../pages/PathwayExplorerPage';
import ConsensusExplorerPage from '../pages/ConsensusExplorerPage';
import TimelinePage from '../pages/TimelinePage';
import OutcomesPage from '../pages/OutcomesPage';
import ReportsPage from '../pages/ReportsPage';
import FHIRContextPage from '../pages/FHIRContextPage';
import AdminPage from '../pages/AdminPage';
import NotFoundPage from '../pages/NotFoundPage';

function AppRoutes() {
  const { user } = useAuth();
  if (!user) return <Routes><Route path="/login" element={<LoginPage />} /><Route path="*" element={<Navigate to="/login" replace />} /></Routes>;
  const isAdmin = user.role === 'platform-admin' || user.role === 'institution-admin';
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/query" element={<QueryWorkspacePage />} />
        <Route path="/evidence" element={<EvidencePage />} />
        <Route path="/pathways" element={<PathwayExplorerPage />} />
        <Route path="/consensus" element={<ConsensusExplorerPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/outcomes" element={<OutcomesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/fhir" element={<FHIRContextPage />} />
        {isAdmin && <Route path="/admin" element={<AdminPage />} />}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}

export default function App() { return <AuthProvider><AppRoutes /></AuthProvider>; }
