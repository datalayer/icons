import { useEffect } from 'react';
import { ThemedProvider, useThemeStore } from '@datalayer/primer-addons';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SiteLayout } from './SiteLayout';
import IconsPage from './DatalayerIcons';

export function App() {
  // Apply default theme/colormode (matrix + light) when no persisted
  // value exists in localStorage. The store persists under 'datalayer-theme'.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const persisted = window.localStorage.getItem('datalayer-theme');
    if (persisted) return;
    const { setTheme, setColorMode } = useThemeStore.getState();
    setTheme('matrix' as Parameters<typeof setTheme>[0]);
    setColorMode('light');
  }, []);

  return (
    <ThemedProvider useStore={useThemeStore}>
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<IconsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemedProvider>
  );
}

export default App;
