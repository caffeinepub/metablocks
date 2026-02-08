import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/AppLayout';
import HubPage from './pages/HubPage';
import SlidingTilesPage from './pages/puzzles/SlidingTilesPage';
import MemoryMatchPage from './pages/puzzles/MemoryMatchPage';
import WordScramblePage from './pages/puzzles/WordScramblePage';
import SudokuMiniPage from './pages/puzzles/SudokuMiniPage';
import LightsOutPage from './pages/puzzles/LightsOutPage';
import LeaderboardPage from './pages/LeaderboardPage';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HubPage,
});

const slidingTilesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/puzzles/sliding',
  component: SlidingTilesPage,
});

const memoryMatchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/puzzles/memory',
  component: MemoryMatchPage,
});

const wordScrambleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/puzzles/words',
  component: WordScramblePage,
});

const sudokuMiniRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/puzzles/sudoku',
  component: SudokuMiniPage,
});

const lightsOutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/puzzles/lights-out',
  component: LightsOutPage,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboard',
  component: LeaderboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  slidingTilesRoute,
  memoryMatchRoute,
  wordScrambleRoute,
  sudokuMiniRoute,
  lightsOutRoute,
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
