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

  const puzzles = [
    {
      title: 'Sliding Tiles',
      icon: '/assets/generated/icon-puzzle-sliding.dim_256x256.png',
      description: 'Arrange the tiles in order by sliding them into place.',
      route: '/puzzles/sliding',
      bestScore: profile?.bestScores.endlessRun,
    },
    {
      title: 'Memory Match',
      icon: '/assets/generated/icon-puzzle-memory.dim_256x256.png',
      description: 'Find matching pairs of cards with the fewest moves.',
      route: '/puzzles/memory',
      bestScore: profile?.bestScores.cityBuilder,
    },
    {
      title: 'Word Scramble',
      icon: '/assets/generated/icon-puzzle-words.dim_256x256.png',
      description: 'Unscramble letters to form the correct word.',
      route: '/puzzles/words',
      bestScore: profile?.bestScores.farming,
    },
    {
      title: 'Sudoku Mini',
      icon: '/assets/generated/icon-puzzle-sudoku.dim_256x256.png',
      description: 'Fill the grid with numbers following sudoku rules.',
      route: '/puzzles/sudoku',
      bestScore: profile?.bestScores.indoor,
    },
    {
      title: 'Lights Out',
      icon: '/assets/generated/icon-puzzle-lightsout.dim_256x256.png',
      description: 'Turn off all the lights by toggling adjacent cells.',
      route: '/puzzles/lights-out',
      bestScore: profile?.bestScores.battle,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/assets/generated/ps-puzzle-hub-bg.dim_1920x1080.png)' }}
        />
        <div className="relative z-10 flex flex-col items-center gap-6 px-8 py-16 text-center">
          <img
            src="/assets/generated/ps-puzzle-logo.dim_512x512.png"
            alt="PS PUZZLE"
            className="h-32 w-32 drop-shadow-2xl"
          />
          <div>
            <h1 className="mb-2 text-5xl font-black tracking-tight">PS PUZZLE</h1>
            <p className="text-lg text-muted-foreground">
              Challenge your mind with five unique puzzle games!
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

      {/* Puzzle Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {puzzles.map((puzzle) => (
          <ModeTile
            key={puzzle.route}
            title={puzzle.title}
            icon={puzzle.icon}
            description={puzzle.description}
            bestScore={isSignedIn && puzzle.bestScore ? Number(puzzle.bestScore) : undefined}
            onClick={() => navigate({ to: puzzle.route })}
          />
        ))}
      </div>
    </div>
  );
}
