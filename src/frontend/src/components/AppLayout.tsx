import { Outlet, useNavigate } from '@tanstack/react-router';
import { Coins, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthStatus from './AuthStatus';
import { usePlayerProfile } from '../hooks/usePlayerProfile';

export default function AppLayout() {
  const navigate = useNavigate();
  const { data: profile } = usePlayerProfile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: '/' })}
              className="hover:bg-accent"
            >
              <Home className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold tracking-tight">PS PUZZLE</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {profile && (
              <div className="flex items-center gap-2 rounded-full bg-accent/50 px-4 py-2">
                <Coins className="h-5 w-5 text-chart-4" />
                <span className="font-bold">{Number(profile.totalCoins)}</span>
              </div>
            )}
            <AuthStatus />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-border/40 bg-card/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026. Built with ❤️ using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
