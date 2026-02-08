import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, RotateCcw, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { usePuzzleBestScores } from '../../hooks/usePuzzleBestScores';
import { GameMode } from '../../backend';
import RequireSignInDialog from '../../components/RequireSignInDialog';

export default function LightsOutPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { saveBestScore, isSaving } = usePuzzleBestScores();
  const [lights, setLights] = useState<boolean[]>([]);
  const [moves, setMoves] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);

  const isSignedIn = identity && !identity.getPrincipal().isAnonymous();

  const initializeGame = () => {
    // Create a solvable puzzle by simulating random clicks
    const newLights = new Array(25).fill(false);
    const clicks = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < clicks; i++) {
      const index = Math.floor(Math.random() * 25);
      toggleLights(newLights, index);
    }
    setLights(newLights);
    setMoves(0);
    setIsPlaying(true);
    setIsComplete(false);
  };

  const toggleLights = (grid: boolean[], index: number) => {
    const row = Math.floor(index / 5);
    const col = index % 5;

    // Toggle center
    grid[index] = !grid[index];

    // Toggle adjacent
    if (row > 0) grid[index - 5] = !grid[index - 5]; // Up
    if (row < 4) grid[index + 5] = !grid[index + 5]; // Down
    if (col > 0) grid[index - 1] = !grid[index - 1]; // Left
    if (col < 4) grid[index + 1] = !grid[index + 1]; // Right
  };

  const handleCellClick = (index: number) => {
    if (!isPlaying || isComplete) return;

    const newLights = [...lights];
    toggleLights(newLights, index);
    setLights(newLights);
    setMoves(moves + 1);

    // Check if all lights are off
    if (newLights.every((light) => !light)) {
      setIsComplete(true);
      setIsPlaying(false);
      handleCompletion();
    }
  };

  const handleCompletion = async () => {
    const score = Math.max(1200 - moves * 15, 200);
    if (isSignedIn) {
      try {
        await saveBestScore(GameMode.battle, score);
      } catch (error) {
        console.error('Failed to save score:', error);
      }
    } else {
      setShowSignInDialog(true);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to PS PUZZLE Hub
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lights Out</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={initializeGame} disabled={isSaving}>
                {isPlaying ? <RotateCcw className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isPlaying ? 'Reset' : 'Start'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between text-sm">
            <div>
              <span className="font-semibold">Moves:</span> {moves}
            </div>
            {isComplete && (
              <div className="font-bold text-chart-4">
                Score: {Math.max(1200 - moves * 15, 200)}
              </div>
            )}
          </div>

          {lights.length === 0 ? (
            <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center">
                <p className="mb-4 text-muted-foreground">Click Start to begin the puzzle</p>
                <Button onClick={initializeGame}>
                  <Play className="mr-2 h-4 w-4" />
                  Start Game
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mx-auto grid w-fit grid-cols-5 gap-2">
                {lights.map((isOn, index) => (
                  <button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    className={`h-16 w-16 rounded-lg transition-all hover:scale-105 active:scale-95 ${
                      isOn ? 'bg-chart-4 shadow-lg shadow-chart-4/50' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Click a cell to toggle it and its adjacent cells. Turn all lights off!
              </div>
            </>
          )}

          {isComplete && (
            <div className="rounded-lg bg-chart-4/10 p-4 text-center">
              <p className="text-lg font-bold text-chart-4">All Lights Out!</p>
              <p className="text-sm text-muted-foreground">
                {isSignedIn ? 'Score saved!' : 'Sign in to save your score'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <RequireSignInDialog open={showSignInDialog} onOpenChange={setShowSignInDialog} />
    </div>
  );
}
