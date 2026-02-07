import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Zap, Puzzle } from 'lucide-react';
import { useState } from 'react';
import ReactionGame from './indoor/ReactionGame';
import PuzzleGame from './indoor/PuzzleGame';

type SubMode = 'menu' | 'reaction' | 'puzzle';

export default function IndoorPage() {
  const navigate = useNavigate();
  const [subMode, setSubMode] = useState<SubMode>('menu');

  if (subMode === 'reaction') {
    return <ReactionGame onBack={() => setSubMode('menu')} />;
  }

  if (subMode === 'puzzle') {
    return <PuzzleGame onBack={() => setSubMode('menu')} />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Hub
        </Button>
        <h1 className="text-3xl font-black">INDOOR GAMES</h1>
        <div className="w-24" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="group cursor-pointer transition-all hover:scale-105 hover:shadow-xl">
          <CardHeader>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-chart-1">
              <Zap className="h-8 w-8" />
            </div>
            <CardTitle>Reaction Game</CardTitle>
            <CardDescription>Test your reflexes! Click as fast as you can when the target appears.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setSubMode('reaction')} className="w-full">
              Play Now
            </Button>
          </CardContent>
        </Card>

        <Card className="group cursor-pointer transition-all hover:scale-105 hover:shadow-xl">
          <CardHeader>
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-chart-2">
              <Puzzle className="h-8 w-8" />
            </div>
            <CardTitle>Puzzle Game</CardTitle>
            <CardDescription>Solve the puzzle by arranging tiles in the correct order.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setSubMode('puzzle')} className="w-full">
              Play Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
