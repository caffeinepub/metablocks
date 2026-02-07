import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { useGameProgress } from '../../hooks/useGameProgress';
import { toast } from 'sonner';
import { GameMode } from '../../backend';

type GameState = 'idle' | 'running' | 'gameOver';

export default function EndlessRunPage() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState(50);
  const [obstacles, setObstacles] = useState<number[]>([]);
  const gameLoopRef = useRef<number | undefined>(undefined);
  const { saveProgress } = useGameProgress();

  useEffect(() => {
    if (gameState === 'running') {
      const loop = () => {
        setScore((s) => s + 1);
        setObstacles((obs) => {
          const newObs = obs.map((o) => o - 2).filter((o) => o > -10);
          if (Math.random() < 0.02) {
            newObs.push(100);
          }
          return newObs;
        });
        gameLoopRef.current = requestAnimationFrame(loop);
      };
      gameLoopRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState !== 'running') return;
      if (e.key === 'ArrowUp' || e.key === ' ') {
        setPosition((p) => Math.max(20, p - 15));
        setTimeout(() => setPosition(50), 300);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'running') {
      const collision = obstacles.some((o) => o > 8 && o < 18 && position > 40);
      if (collision) {
        handleGameOver();
      }
    }
  }, [obstacles, position, gameState]);

  const handleGameOver = async () => {
    setGameState('gameOver');
    const coins = Math.floor(score / 10);
    try {
      await saveProgress(GameMode.endlessRun, score, coins);
      toast.success(`Game Over! Score: ${score}, Coins earned: ${coins}`);
    } catch (error) {
      toast.error('Failed to save progress');
    }
  };

  const startGame = () => {
    setGameState('running');
    setScore(0);
    setPosition(50);
    setObstacles([]);
  };

  const resetGame = () => {
    setGameState('idle');
    setScore(0);
    setPosition(50);
    setObstacles([]);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Hub
        </Button>
        <h1 className="text-3xl font-black">ENDLESS RUN</h1>
        <div className="w-24" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Score: {score}</span>
            {gameState === 'running' && <span className="text-sm text-muted-foreground">Press SPACE or ↑ to jump</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-64 overflow-hidden rounded-lg border-2 border-border bg-gradient-to-b from-accent/20 to-accent/5">
            {/* Player */}
            <div
              className="absolute left-8 h-8 w-8 rounded bg-chart-1 transition-all duration-300"
              style={{ bottom: `${position}%` }}
            />
            {/* Obstacles */}
            {obstacles.map((obs, i) => (
              <div
                key={i}
                className="absolute bottom-0 h-12 w-6 rounded-t bg-destructive"
                style={{ left: `${obs}%` }}
              />
            ))}
            {/* Ground */}
            <div className="absolute bottom-0 h-2 w-full bg-border" />
          </div>

          <div className="mt-6 flex justify-center gap-4">
            {gameState === 'idle' && (
              <Button onClick={startGame} size="lg" className="gap-2">
                <Play className="h-5 w-5" />
                Start Game
              </Button>
            )}
            {gameState === 'gameOver' && (
              <>
                <Button onClick={resetGame} variant="outline" size="lg" className="gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Try Again
                </Button>
                <Button onClick={() => navigate({ to: '/' })} size="lg">
                  Back to Hub
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
