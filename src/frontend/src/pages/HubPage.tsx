import { useNavigate } from '@tanstack/react-router';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModeTile from '../components/ModeTile';
import RequireSignInDialog from '../components/RequireSignInDialog';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { usePlayerProfile } from '../hooks/usePlayerProfile';
import { useState } from 'react';

export default function HubPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: profile } = usePlayerProfile();
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<string>('');

  const isSignedIn = identity && !identity.getPrincipal().isAnonymous();

  const handleModeClick = (route: string) => {
    if (!isSignedIn) {
      setPendingRoute(route);
      setShowSignInDialog(true);
    } else {
      navigate({ to: route });
    }
  };

  const modes = [
    {
      title: 'Endless Run',
      icon: '/assets/generated/icon-endless-run.dim_256x256.png',
      description: 'Run, jump, and collect coins in this fast-paced runner!',
      route: '/endless-run',
      bestScore: profile?.bestScores.endlessRun,
    },
    {
      title: 'City Builder',
      icon: '/assets/generated/icon-city-builder.dim_256x256.png',
      description: 'Build your dream city with houses, shops, and parks.',
      route: '/city-builder',
      bestScore: profile?.bestScores.cityBuilder,
    },
    {
      title: 'Farming',
      icon: '/assets/generated/icon-farming.dim_256x256.png',
      description: 'Plant crops, watch them grow, and harvest for rewards.',
      route: '/farming',
      bestScore: profile?.bestScores.farming,
    },
    {
      title: 'Indoor Games',
      icon: '/assets/generated/icon-indoor.dim_256x256.png',
      description: 'Challenge yourself with quick reaction and puzzle games.',
      route: '/indoor',
      bestScore: profile?.bestScores.indoor,
    },
    {
      title: 'Car Racing',
      icon: '/assets/generated/icon-car.dim_256x256.png',
      description: 'Race against the clock and set the best time!',
      route: '/car',
      bestScore: profile?.bestScores.car,
    },
    {
      title: 'Battle Arena',
      icon: '/assets/generated/icon-battle.dim_256x256.png',
      description: 'Fight CPU opponents in turn-based combat.',
      route: '/battle',
      bestScore: profile?.bestScores.battle,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/assets/generated/metablocks-hub-bg.dim_1920x1080.png)' }}
        />
        <div className="relative z-10 flex flex-col items-center gap-6 px-8 py-16 text-center">
          <img
            src="/assets/generated/metablocks-logo.dim_512x512.png"
            alt="Metablocks"
            className="h-32 w-32 drop-shadow-2xl"
          />
          <div>
            <h1 className="mb-2 text-5xl font-black tracking-tight">METABLOCKS</h1>
            <p className="text-lg text-muted-foreground">
              Six worlds of adventure await. Choose your game!
            </p>
          </div>
          <Button
            size="lg"
            variant="outline"
            className="gap-2"
            onClick={() => navigate({ to: '/leaderboard' })}
          >
            <Trophy className="h-5 w-5" />
            View Leaderboard
          </Button>
        </div>
      </div>

      {/* Game Modes Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {modes.map((mode) => (
          <ModeTile
            key={mode.route}
            title={mode.title}
            icon={mode.icon}
            description={mode.description}
            bestScore={mode.bestScore ? Number(mode.bestScore) : undefined}
            onClick={() => handleModeClick(mode.route)}
          />
        ))}
      </div>

      <RequireSignInDialog open={showSignInDialog} onOpenChange={setShowSignInDialog} />
    </div>
  );
}
