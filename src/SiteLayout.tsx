import { useEffect, useState } from 'react';
import { Box, Link, Text } from '@primer/react';
import { AppearanceControlsWithStore, useThemeStore } from '@datalayer/primer-addons';
import { DatalayerLogoText } from '@datalayer/primer-addons';
import { Link as RouterLink, Outlet, useLocation, useSearchParams } from 'react-router-dom';

type NavItem = {
  to: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { to: '/svg', label: 'SVG' },
  { to: '/icons', label: 'Icons' },
];

export function SiteLayout() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { colorMode, theme } = useThemeStore();
  const [logoSize, setLogoSize] = useState(26);

  // Sync ?theme=...&colormode=... URL params into the theme store so the
  // appearance is fully controllable from the URL (handy for screenshots and
  // sharing styled pages).
  useEffect(() => {
    const themeParam = searchParams.get('theme');
    const colorModeParam = searchParams.get('colormode') ?? searchParams.get('colorMode');
    const { setTheme, setColorMode } = useThemeStore.getState();
    if (themeParam) {
      setTheme(themeParam as Parameters<typeof setTheme>[0]);
    }
    if (colorModeParam) {
      const normalized = colorModeParam.toLowerCase();
      // Map common synonyms (night -> dark, day -> light, system -> auto).
      const map: Record<string, 'light' | 'dark' | 'auto'> = {
        night: 'dark',
        dark: 'dark',
        day: 'light',
        light: 'light',
        system: 'auto',
        auto: 'auto',
      };
      const resolved = map[normalized];
      if (resolved) {
        setColorMode(resolved);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const applyLogoSize = () => {
      const width = window.innerWidth;
      if (width < 544) {
        setLogoSize(20);
      } else if (width < 768) {
        setLogoSize(22);
      } else {
        setLogoSize(26);
      }
    };

    applyLogoSize();
    window.addEventListener('resize', applyLogoSize);
    return () => {
      window.removeEventListener('resize', applyLogoSize);
    };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bg: 'canvas.default' }}>
      <Box
        as="header"
        sx={{
          borderBottom: '1px solid',
          borderColor: 'border.default',
          px: 4,
          py: 3,
          position: 'sticky',
          top: 0,
          bg: 'canvas.default',
          zIndex: 10,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 28 }}>
            <Link
              as={RouterLink}
              to="/"
              aria-label="Go to home"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                ':hover': { textDecoration: 'none' },
              }}
            >
              <DatalayerLogoText
                size={logoSize}
                variant={theme}
                colorMode={colorMode as 'light' | 'dark' | 'auto'}
              />
            </Link>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Box as="nav" sx={{ display: 'flex', gap: 2 }}>
              {NAV_ITEMS.map((item) => {
                const active = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
                return (
                  <Link
                    key={item.to}
                    as={RouterLink}
                    to={item.to}
                    sx={{
                      color: active ? 'accent.fg' : 'fg.default',
                      textDecoration: 'none',
                      fontWeight: active ? 600 : 400,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      ':hover': { bg: 'canvas.subtle' },
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </Box>
            <AppearanceControlsWithStore useStore={useThemeStore} />
          </Box>
        </Box>
      </Box>

      <Box as="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      <Box as="footer" sx={{ borderTop: '1px solid', borderColor: 'border.default', px: 4, py: 4, bg: 'canvas.subtle' }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', display: 'flex', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
          <Text sx={{ color: 'fg.muted', fontSize: 1 }}>
            Datalayer Design
          </Text>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="https://datalayer.ai" target="_blank">Datalayer</Link>
            <Link href="https://datalayer.ai/docs" target="_blank">Docs</Link>
            <Link href="https://github.com/datalayer" target="_blank">GitHub</Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default SiteLayout;
