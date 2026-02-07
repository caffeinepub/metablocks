import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { useGameProgress } from '../../../hooks/useGameProgress';
import { toast } from 'sonner';
import { GameMode } from '../../../backend';

interface PuzzleGameProps {
  onBack: () => void;
}

type GameState = 'idle' | 'playing' | 'won';

const GRID_SIZE = 3;

export default function PuzzleGame({ onBack }: PuzzleGameProps) {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const { saveProgress } = useGameProgress();

  const initializePuzzle = () => {
    const numbers = Array.from({ length: GRID_SIZE * GRID_SIZE - 1 }, (_, i) => i + 1);
    numbers.push(0);
    const shuffled = [...numbers].sort(() => Math.random() - 0.5);
    setTiles(shuffled);
    setMoves(0);
    setStartTime(Date.now());
    setGameState('playing');
  };

  const isSolved = () => {
    for (let i = 0; i < tiles.length - 1; i++) {
      if (tiles[i] !== i + 1) return false;
    }
    return tiles[tiles.length - 1] === 0;
  };

  useEffect(() => {
    if (gameState === 'playing' && isSolved()) {
      finishGame();
    }
  }, [tiles, gameState]);

  const finishGame = async () => {
    setGameState('won');
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const score = Math.max(0, 1000 - moves * 10 - timeTaken * 5);
    const coins = Math.floor(score / 50);
    try {
      await saveProgress(GameMode.indoor, score, coins);
      toast.success(`Puzzle solved! Moves: ${moves}, Time: ${timeTaken}s, Coins: ${coins}`);
    } catch (error) {
      toast.error('Failed to save score');
    }
  };

  const handleTileClick = (index: number) => {
    if (gameState !== 'playing') return;

    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
    const emptyCol = emptyIndex % GRID_SIZE;

    const isAdjacent =
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) || (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves((m) => m + 1);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Indoor
        </Button>
        <h2 className="text-2xl font-black">PUZZLE GAME</h2>
        <div className="w-24" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Moves: {moves}</span>
            {gameState === 'playing' && (
              <span className="text-sm text-muted-foreground">Arrange tiles 1-8 in order</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mx-auto max-w-sm">
            <div className="grid grid-cols-3 gap-2">
              {tiles.map((tile, index) => (
                <button
                  key={index}
                  onClick={() => handleTileClick(index)}
                  disabled={gameState !== 'playing'}
                  className={`aspect-square rounded-lg text-2xl font-bold transition-all ${
                    tile === 0
                      ? 'bg-muted/20'
                      : 'bg-chart-2 hover:scale-105 hover:bg-chart-2/80 disabled:hover:scale-100'
                  }`}
                >
                  {tile !== 0 && tile}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            {gameState === 'idle' && (
              <Button onClick={initializePuzzle} size="lg" className="gap-2">
                <Play className="h-5 w-5" />
                Start Game
              </Button>
            )}
            {gameState === 'won' && (
              <>
                <Button onClick={initializePuzzle} variant="outline" size="lg" className="gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Play Again
                </Button>
                <Button onClick={onBack} size="lg">
                  Back to Indoor
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
