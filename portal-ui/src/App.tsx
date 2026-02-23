import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { Layout } from './components/Layout';
import { ArtifactDetailPage } from './pages/ArtifactDetailPage';
import { CataloguePage } from './pages/CataloguePage';
import { EditorPage } from './pages/EditorPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { NewArtifactPage } from './pages/NewArtifactPage';
import { OidcCallbackPage } from './pages/OidcCallbackPage';
import { PublishPage } from './pages/PublishPage';
import { SelectTenantPage } from './pages/SelectTenantPage';
import { RequireAuth } from './routes/RequireAuth';
import { RequireTenant } from './routes/RequireTenant';
import { TenantProvider } from './tenancy/TenantContext';

function App() {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TenantProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/oidc/callback" element={<OidcCallbackPage />} />

              <Route element={<RequireAuth />}>
                <Route path="/select-tenant" element={<SelectTenantPage />} />
                <Route element={<RequireTenant />}>
                  <Route element={<Layout />}>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/catalogue" element={<CataloguePage />} />
                    <Route path="/catalogue/new" element={<NewArtifactPage />} />
                    <Route path="/artifact/:id" element={<ArtifactDetailPage />} />
                    <Route path="/editor/:artifactId/:versionId" element={<EditorPage />} />
                    <Route path="/publish/:artifactId/:versionId" element={<PublishPage />} />
                    <Route path="*" element={<Navigate to="/home" replace />} />
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </TenantProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
