import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, RotateCcw, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { usePuzzleBestScores } from '../../hooks/usePuzzleBestScores';
import { GameMode } from '../../backend';
import RequireSignInDialog from '../../components/RequireSignInDialog';

type Tile = number | null;

export default function SlidingTilesPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { saveBestScore, isSaving } = usePuzzleBestScores();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [moves, setMoves] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);

  const isSignedIn = identity && !identity.getPrincipal().isAnonymous();

  const initializePuzzle = () => {
    const newTiles: Tile[] = [1, 2, 3, 4, 5, 6, 7, 8, null];
    // Shuffle
    for (let i = 0; i < 100; i++) {
      const emptyIndex = newTiles.indexOf(null);
      const validMoves = getValidMoves(emptyIndex);
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      [newTiles[emptyIndex], newTiles[randomMove]] = [newTiles[randomMove], newTiles[emptyIndex]];
    }
    setTiles(newTiles);
    setMoves(0);
    setIsPlaying(true);
    setIsComplete(false);
  };

  const getValidMoves = (emptyIndex: number): number[] => {
    const moves: number[] = [];
    const row = Math.floor(emptyIndex / 3);
    const col = emptyIndex % 3;

    if (row > 0) moves.push(emptyIndex - 3); // Up
    if (row < 2) moves.push(emptyIndex + 3); // Down
    if (col > 0) moves.push(emptyIndex - 1); // Left
    if (col < 2) moves.push(emptyIndex + 1); // Right

    return moves;
  };

  const handleTileClick = (index: number) => {
    if (!isPlaying || isComplete) return;

    const emptyIndex = tiles.indexOf(null);
    const validMoves = getValidMoves(emptyIndex);

    if (validMoves.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setMoves(moves + 1);

      // Check if solved
      const isSolved = newTiles.every((tile, i) => tile === null || tile === i + 1);
      if (isSolved) {
        setIsComplete(true);
        setIsPlaying(false);
        handleCompletion();
      }
    }
  };

  const handleCompletion = async () => {
    const score = Math.max(1000 - moves * 10, 100);
    if (isSignedIn) {
      try {
        await saveBestScore(GameMode.endlessRun, score);
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
            <span>Sliding Tiles</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={initializePuzzle} disabled={isSaving}>
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
                Score: {Math.max(1000 - moves * 10, 100)}
              </div>
            )}
          </div>

          {tiles.length === 0 ? (
            <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center">
                <p className="mb-4 text-muted-foreground">Click Start to begin the puzzle</p>
                <Button onClick={initializePuzzle}>
                  <Play className="mr-2 h-4 w-4" />
                  Start Game
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {tiles.map((tile, index) => (
                <button
                  key={index}
                  onClick={() => handleTileClick(index)}
                  disabled={!isPlaying || tile === null}
                  className={`aspect-square rounded-lg text-2xl font-bold transition-all ${
                    tile === null
                      ? 'bg-muted/30'
                      : 'bg-accent hover:scale-105 hover:bg-accent/80 active:scale-95'
                  }`}
                >
                  {tile}
                </button>
              ))}
            </div>
          )}

          {isComplete && (
            <div className="rounded-lg bg-chart-4/10 p-4 text-center">
              <p className="text-lg font-bold text-chart-4">Puzzle Complete!</p>
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
