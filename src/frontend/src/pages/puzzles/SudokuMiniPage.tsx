import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, RotateCcw, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { usePuzzleBestScores } from '../../hooks/usePuzzleBestScores';
import { GameMode } from '../../backend';
import RequireSignInDialog from '../../components/RequireSignInDialog';

type Cell = number | null;

export default function SudokuMiniPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { saveBestScore, isSaving } = usePuzzleBestScores();
  const [grid, setGrid] = useState<Cell[]>([]);
  const [solution, setSolution] = useState<number[]>([]);
  const [fixedCells, setFixedCells] = useState<boolean[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);

  const isSignedIn = identity && !identity.getPrincipal().isAnonymous();

  const generatePuzzle = () => {
    // Simple 4x4 sudoku
    const solutions = [
      [1, 2, 3, 4, 3, 4, 1, 2, 2, 3, 4, 1, 4, 1, 2, 3],
      [2, 1, 4, 3, 4, 3, 2, 1, 1, 4, 3, 2, 3, 2, 1, 4],
      [3, 4, 1, 2, 1, 2, 3, 4, 4, 1, 2, 3, 2, 3, 4, 1],
    ];
    const sol = solutions[Math.floor(Math.random() * solutions.length)];
    setSolution(sol);

    // Remove some numbers
    const newGrid: Cell[] = [...sol];
    const fixed: boolean[] = new Array(16).fill(true);
    const indicesToRemove = [0, 2, 5, 7, 8, 10, 13, 15];
    indicesToRemove.forEach((i) => {
      newGrid[i] = null;
      fixed[i] = false;
    });

    setGrid(newGrid);
    setFixedCells(fixed);
    setMistakes(0);
    setIsPlaying(true);
    setIsComplete(false);
  };

  const handleCellClick = (index: number, value: number) => {
    if (!isPlaying || isComplete || fixedCells[index]) return;

    const newGrid = [...grid];
    newGrid[index] = value;
    setGrid(newGrid);

    if (value !== solution[index]) {
      setMistakes(mistakes + 1);
    }

    // Check if complete
    const isSolved = newGrid.every((cell, i) => cell === solution[i]);
    if (isSolved) {
      setIsComplete(true);
      setIsPlaying(false);
      handleCompletion();
    }
  };

  const handleCompletion = async () => {
    const score = Math.max(1500 - mistakes * 100, 300);
    if (isSignedIn) {
      try {
        await saveBestScore(GameMode.indoor, score);
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
            <span>Sudoku Mini (4x4)</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={generatePuzzle} disabled={isSaving}>
                {isPlaying ? <RotateCcw className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isPlaying ? 'Reset' : 'Start'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between text-sm">
            <div>
              <span className="font-semibold">Mistakes:</span> {mistakes}
            </div>
            {isComplete && (
              <div className="font-bold text-chart-4">
                Score: {Math.max(1500 - mistakes * 100, 300)}
              </div>
            )}
          </div>

          {grid.length === 0 ? (
            <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center">
                <p className="mb-4 text-muted-foreground">Click Start to begin the puzzle</p>
                <Button onClick={generatePuzzle}>
                  <Play className="mr-2 h-4 w-4" />
                  Start Game
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mx-auto grid w-fit grid-cols-4 gap-1 rounded-lg border-4 border-border p-2">
                {grid.map((cell, index) => (
                  <div key={index} className="relative">
                    {cell === null ? (
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4].map((num) => (
                          <button
                            key={num}
                            onClick={() => handleCellClick(index, num)}
                            className="h-12 w-12 rounded bg-muted text-sm font-bold transition-all hover:scale-105 hover:bg-accent"
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded text-2xl font-bold ${
                          fixedCells[index] ? 'bg-accent/50' : 'bg-accent'
                        }`}
                      >
                        {cell}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Fill each row and column with numbers 1-4 (no repeats)
              </div>
            </>
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
