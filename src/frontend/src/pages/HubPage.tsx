import { useNavigate } from '@tanstack/react-router';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModeTile from '../components/ModeTile';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { usePlayerProfile } from '../hooks/usePlayerProfile';

export default function HubPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: profile } = usePlayerProfile();

  const isSignedIn = identity && !identity.getPrincipal().isAnonymous();

  const modes = [
    {
      title: 'Endless Run',
      icon: '/assets/generated/icon-endless-run.dim_256x256.png',
      description: 'Jump over obstacles and run as far as you can!',
      route: '/modes/endless-run',
      bestScore: profile?.bestScores.endlessRun,
    },
    {
      title: 'City Builder',
      icon: '/assets/generated/icon-city-builder.dim_256x256.png',
      description: 'Build your dream city with houses, shops, and parks.',
      route: '/modes/city-builder',
      bestScore: profile?.bestScores.cityBuilder,
    },
    {
      title: 'Farming',
      icon: '/assets/generated/icon-farming.dim_256x256.png',
      description: 'Plant crops, watch them grow, and harvest rewards.',
      route: '/modes/farming',
      bestScore: profile?.bestScores.farming,
    },
    {
      title: 'Indoor',
      icon: '/assets/generated/icon-indoor.dim_256x256.png',
      description: 'Play reaction and puzzle minigames indoors.',
      route: '/modes/indoor',
      bestScore: profile?.bestScores.indoor,
    },
    {
      title: 'Car Racing',
      icon: '/assets/generated/icon-car.dim_256x256.png',
      description: 'Race against the clock and set the best time.',
      route: '/modes/car',
      bestScore: profile?.bestScores.car,
    },
    {
      title: 'Battle',
      icon: '/assets/generated/icon-battle.dim_256x256.png',
      description: 'Fight enemies in turn-based combat battles.',
      route: '/modes/battle',
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
            <h1 className="mb-2 text-5xl font-black tracking-tight">Metablocks</h1>
            <p className="text-lg text-muted-foreground">
              Explore six unique game modes and build your legacy!
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

      {/* Mode Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {modes.map((mode) => (
          <ModeTile
            key={mode.route}
            title={mode.title}
            icon={mode.icon}
            description={mode.description}
            bestScore={isSignedIn && mode.bestScore ? Number(mode.bestScore) : undefined}
            onClick={() => navigate({ to: mode.route })}
          />
        ))}
      </div>
    </div>
  );
}
