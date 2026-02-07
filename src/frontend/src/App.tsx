import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/AppLayout';
import HubPage from './pages/HubPage';
import EndlessRunPage from './pages/modes/EndlessRunPage';
import CityBuilderPage from './pages/modes/CityBuilderPage';
import FarmingPage from './pages/modes/FarmingPage';
import IndoorPage from './pages/modes/IndoorPage';
import CarPage from './pages/modes/CarPage';
import BattlePage from './pages/modes/BattlePage';
import LeaderboardPage from './pages/LeaderboardPage';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HubPage,
});

const endlessRunRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/endless-run',
  component: EndlessRunPage,
});

const cityBuilderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/city-builder',
  component: CityBuilderPage,
});

const farmingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/farming',
  component: FarmingPage,
});

const indoorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/indoor',
  component: IndoorPage,
});

const carRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/car',
  component: CarPage,
});

const battleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/battle',
  component: BattlePage,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboard',
  component: LeaderboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  endlessRunRoute,
  cityBuilderRoute,
  farmingRoute,
  indoorRoute,
  carRoute,
  battleRoute,
  leaderboardRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
